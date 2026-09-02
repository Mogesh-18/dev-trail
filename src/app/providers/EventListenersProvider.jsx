import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { on, EVENTS } from "@/app/events/bus";
import { ActivityService } from "@/features/progress/services/activity.service";

const ACTIVITY_LOG_MAP = {
    [EVENTS.TASK_STARTED]: (detail) => ({ type: EVENTS.TASK_STARTED, entityType: "task", entityId: detail.taskId }),
    [EVENTS.TASK_COMPLETED]: (detail) => ({ type: EVENTS.TASK_COMPLETED, entityType: "task", entityId: detail.taskId }),
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

// The only place task/assignment lifecycle events turn into Activity rows.
// TaskService and ProgressService only emit events — they don't know this
// listener, or the Activity table, exist. This is the concrete example from
// the architecture doc: Task completed -> Event Bus -> Activity creation.
export function EventListenersProvider({ children }) {
    const queryClient = useQueryClient();

    useEffect(() => {
        const unsubscribers = Object.entries(ACTIVITY_LOG_MAP).map(([eventName, toEntry]) =>
            on(eventName, async (detail) => {
                await ActivityService.log(toEntry(detail));
                queryClient.invalidateQueries({ queryKey: ["activity"] });
            })
        );
        return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
    }, [queryClient]);

    return children;
}