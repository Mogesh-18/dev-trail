import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { useActivityPaginated } from "@/features/progress/hooks/useProgress";
import { formatRelativeTime } from "@/utils/format-date";

const ACTIVITY_LABELS = {
    TASK_STARTED: "started",
    TASK_COMPLETED: "completed",
    ASSIGNMENT_SUBMITTED: "submitted",
    ASSIGNMENT_COMPLETED: "completed",
};

export function ActivityTimeline({ tasksById, assignmentsById, pageSize = 10 }) {
    const { items: activity, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useActivityPaginated(pageSize);

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
    if (activity.length === 0) return <p className="text-sm text-muted-foreground">No activity yet.</p>;

    return (
        <div className="space-y-3">
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
            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
        </div>
    );
}