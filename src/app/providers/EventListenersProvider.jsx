import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { on, EVENTS } from "@/app/events/bus";
import { ActivityService } from "@/features/progress/services/activity.service";

/**
 * Maps task/assignment lifecycle events to activity log entries.
 * Each mapping function receives the event detail and returns an object
 * with `type`, `entityType`, and `entityId` for `ActivityService.log()`.
 * 
 * @type {Record<string, (detail: any) => { type: string, entityType: string, entityId: string | number }>}
 */
const ACTIVITY_LOG_MAP = {
    [EVENTS.TASK_STARTED]: (detail) => ({
        type: EVENTS.TASK_STARTED,
        entityType: "task",
        entityId: detail.taskId
    }),
    [EVENTS.TASK_COMPLETED]: (detail) => ({
        type: EVENTS.TASK_COMPLETED,
        entityType: "task",
        entityId: detail.taskId
    }),
    [EVENTS.REPORT_SUBMITTED]: (detail) => ({
        type: EVENTS.REPORT_SUBMITTED,
        entityType: "task",
        entityId: detail.taskId
    }),
    [EVENTS.ASSIGNMENT_SUBMITTED]: (detail) => ({
        type: EVENTS.ASSIGNMENT_SUBMITTED,
        entityType: "assignment",
        entityId: detail.assignmentId,
    }),
    [EVENTS.ASSIGNMENT_COMPLETED]: (detail) => ({
        type: EVENTS.ASSIGNMENT_COMPLETED,
        entityType: "assignment",
        entityId: detail.assignmentId,
    }),
};

/**
 * Maps event types to push notification payloads for the opposite role.
 * Used by `EventListenersProvider` to fire notifications on push-worthy events.
 * 
 * @type {Record<string, (detail: any) => { title: string, body: string, url: string }>}
 */
const PUSH_NOTIFY_MAP = {
    [EVENTS.TASK_CREATED]: (detail) => ({ 
        title: "New task added", 
        body: detail.title, 
        url: "/student/tasks" 
    }),
    [EVENTS.TASK_COMPLETED]: (detail) => ({ 
        title: "Task completed", 
        body: detail.title || "A task was completed", 
        url: "/admin/progress" 
    }),
    [EVENTS.REPORT_SUBMITTED]: () => ({ 
        title: "New report added", 
        body: "A new task report was submitted", 
        url: "/admin/notes" 
    }),
    [EVENTS.ASSIGNMENT_CREATED]: (detail) => ({ 
        title: "New assignment", 
        body: detail.title, 
        url: "/student/assignments" 
    }),
    [EVENTS.ASSIGNMENT_SUBMITTED]: (detail) => ({ 
        title: "Assignment submitted", 
        body: detail.title, 
        url: "/admin/assignments" 
    }),
    [EVENTS.ASSIGNMENT_COMPLETED]: (detail) => ({ 
        title: "Assignment approved", 
        body: detail.title, 
        url: "/student/assignments" 
    }),
    [EVENTS.ASSIGNMENT_CHANGES_REQUESTED]: (detail) => ({ 
        title: "Changes requested", 
        body: detail.title, 
        url: "/student/assignments" 
    }),
};

/**
 * React provider that registers event listeners for task/assignment lifecycle
 * events and automatically logs them as activity rows via `ActivityService`.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components.
 * @returns {React.ReactNode} The provider's children.
 */
export function EventListenersProvider({ children }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const activityUnsubscribers = Object.entries(ACTIVITY_LOG_MAP).map(([eventName, toEntry]) =>
            on(eventName, async (detail) => {
                await ActivityService.log(toEntry(detail));
                queryClient.invalidateQueries({ 
                    queryKey: ["activity"] 
                });
            })
        );

        const pushUnsubscribers = Object.entries(PUSH_NOTIFY_MAP).map(([eventName, toPayload]) =>
            on(eventName, (detail) => {
                PushService.notifyOtherRole(toPayload(detail));
            })
        );

        return () => {
            activityUnsubscribers.forEach((unsubscribe) => unsubscribe());
            pushUnsubscribers.forEach((unsubscribe) => unsubscribe());
        };
    }, [queryClient]);

    return children;
}