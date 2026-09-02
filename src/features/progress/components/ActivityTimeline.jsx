import { formatRelativeTime } from "@/utils/format-date";

const ACTIVITY_LABELS = {
    TASK_STARTED: "started",
    TASK_COMPLETED: "completed",
    ASSIGNMENT_SUBMITTED: "submitted",
    ASSIGNMENT_COMPLETED: "completed",
};

export function ActivityTimeline({ activity, tasksById, assignmentsById }) {
    if (activity.length === 0) {
        return <p className="text-sm text-muted-foreground">No activity yet.</p>;
    }

    return (
        <ul className="space-y-3">
            {activity.map((entry) => {
                const entityTitle =
                    entry.entityType === "task" ? tasksById[entry.entityId]?.title : assignmentsById[entry.entityId]?.title;
                return (
                    <li key={entry.id} className="flex items-start justify-between gap-3 text-sm">
                        <span>
                            {entityTitle ?? entry.entityType} — {ACTIVITY_LABELS[entry.type] ?? entry.type.toLowerCase()}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(entry.createdAt)}</span>
                    </li>
                );
            })}
        </ul>
    );
}