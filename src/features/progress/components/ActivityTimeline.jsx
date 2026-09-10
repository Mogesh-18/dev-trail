import { CheckCircle2, PlayCircle, FileUp, Send } from "lucide-react";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { TrailLoader } from "@/components/common/TrailLoader";
import { useActivityPaginated } from "@/features/progress/hooks/useProgress";
import { formatRelativeTime } from "@/utils/format-date";

/**
 * Human‑readable labels for activity event types.
 * 
 * @type {Record<string, string>}
 */
const ACTIVITY_META = {
    TASK_STARTED: { label: "started", icon: PlayCircle, tone: "text-status-progress bg-status-progress/10" },
    TASK_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
    REPORT_SUBMITTED: { label: "added a report to", icon: FileUp, tone: "text-secondary bg-secondary/10" },
    ASSIGNMENT_SUBMITTED: { label: "submitted", icon: Send, tone: "text-status-progress bg-status-progress/10" },
    ASSIGNMENT_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
};

/**
 * Activity feed — each entry now gets an icon badge (color-coded by
 * event type) instead of being plain text, and a thin connecting line
 * runs behind them, echoing the Sidebar's trail visual so the same
 * "checkpoints on a line" idea shows up wherever a sequence of events
 * is displayed.
 *
 * @param {Object} props
 * @param {Record<string, Object>} props.tasksById
 * @param {Record<string, Object>} props.assignmentsById
 * @param {number} [props.pageSize=10]
 * @returns {JSX.Element}
 */
export function ActivityTimeline({ tasksById, assignmentsById, pageSize = 10 }) {
    const { items: activity, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useActivityPaginated(pageSize);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrailLoader size="sm" />
                Loading…
            </div>
        );
    }
    if (activity.length === 0) return <p className="text-sm text-muted-foreground">No activity yet.</p>;

    return (
        <div className="space-y-3">
            <ul className="relative space-y-3">
                <div className="pointer-events-none absolute bottom-4 left-[11px] top-2 w-px bg-border" />
                {activity.map((entry, i) => {
                    const meta = ACTIVITY_META[entry.type] ?? { label: entry.type.toLowerCase(), icon: CheckCircle2, tone: "text-muted-foreground bg-muted" };
                    const Icon = meta.icon;
                    const entityTitle = entry.entityType === "task" ? tasksById[entry.entityId]?.title : assignmentsById[entry.entityId]?.title;
                    return (
                        <li
                            key={entry.id}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className="relative flex items-start justify-between gap-3 text-sm duration-base animate-in fade-in slide-in-from-left-1 fill-mode-both"
                        >
                            <span className="flex items-center gap-2.5">
                                <span className={`relative z-10 flex h-5.5 h-6 w-6 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                                    <Icon className="h-3.5 w-3.5" />
                                </span>
                                <span>
                                    {entityTitle ?? entry.entityType} — {meta.label}
                                </span>
                            </span>
                            <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatRelativeTime(entry.createdAt)}</span>
                        </li>
                    );
                })}
            </ul>
            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
        </div>
    );
}