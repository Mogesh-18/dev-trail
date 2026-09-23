import { CheckCircle2, PlayCircle, FileUp, Send, CalendarX, MousePointerClick } from "lucide-react";
import { EmptyState } from "@/components/common/EmptyState";

const ACTIVITY_META = {
    TASK_STARTED: { label: "started", icon: PlayCircle, tone: "text-status-progress bg-status-progress/10" },
    TASK_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
    REPORT_SUBMITTED: { label: "added a report to", icon: FileUp, tone: "text-secondary bg-secondary/10" },
    ASSIGNMENT_SUBMITTED: { label: "submitted", icon: Send, tone: "text-status-progress bg-status-progress/10" },
    ASSIGNMENT_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
};

/**
 * Inline quick-view for a selected calendar day — replaces the earlier
 * centered DayProgressDialog. Always rendered alongside the calendar
 * (not a modal): shows a "pick a date" empty state until one is
 * selected, then updates in place as the selection changes. On
 * mobile it stacks below the calendar via the page's grid layout.
 *
 * @param {Object} props
 * @param {string|null} props.dateKey
 * @param {Array} props.entries
 * @param {Record<string, Object>} props.tasksById
 * @param {Record<string, Object>} props.assignmentsById
 * @returns {JSX.Element}
 */
export function DayQuickViewPanel({ dateKey, entries, tasksById, assignmentsById }) {
    if (!dateKey) {
        return (
            <div className="flex min-h-[240px] items-center justify-center rounded-lg border border-dashed border-border p-4">
                <EmptyState icon={MousePointerClick} title="Pick a date" description="Select a day on the calendar to see what happened." />
            </div>
        );
    }

    const label = new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-right-1">
            <h3 className="mb-3 text-sm font-semibold tracking-tight">{label}</h3>
            {entries.length === 0 ? (
                <EmptyState icon={CalendarX} title="Nothing happened this day" description="No task or assignment activity was recorded." />
            ) : (
                <ul className="space-y-2">
                    {entries.map((entry, i) => {
                        const meta = ACTIVITY_META[entry.type] ?? { label: entry.type.toLowerCase(), icon: CheckCircle2, tone: "text-muted-foreground bg-muted" };
                        const Icon = meta.icon;
                        const entityTitle = entry.entityType === "task" ? tasksById[entry.entityId]?.title : assignmentsById[entry.entityId]?.title;
                        const time = new Date(entry.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

                        return (
                            <li
                                key={entry.id}
                                style={{ animationDelay: `${i * 30}ms` }}
                                className="flex items-center gap-3 rounded-md border border-border/60 p-2.5 text-sm duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                            >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.tone}`}>
                                    <Icon className="h-4 w-4" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    {entityTitle ?? entry.entityType} — {meta.label}
                                </span>
                                <span className="shrink-0 font-mono text-xs text-muted-foreground">{time}</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}