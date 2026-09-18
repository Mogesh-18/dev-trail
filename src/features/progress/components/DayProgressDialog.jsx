import { CheckCircle2, PlayCircle, FileUp, Send } from "lucide-react";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { CalendarX } from "lucide-react";

const ACTIVITY_META = {
    TASK_STARTED: { label: "started", icon: PlayCircle, tone: "text-status-progress bg-status-progress/10" },
    TASK_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
    REPORT_SUBMITTED: { label: "added a report to", icon: FileUp, tone: "text-secondary bg-secondary/10" },
    ASSIGNMENT_SUBMITTED: { label: "submitted", icon: Send, tone: "text-status-progress bg-status-progress/10" },
    ASSIGNMENT_COMPLETED: { label: "completed", icon: CheckCircle2, tone: "text-status-completed bg-status-completed/10" },
};

/**
 * Shows every activity entry for one selected calendar day.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {string|null} props.dateKey - "YYYY-MM-DD" or null when closed.
 * @param {Array} props.entries - Activity entries for that day.
 * @param {Record<string, Object>} props.tasksById
 * @param {Record<string, Object>} props.assignmentsById
 * @returns {JSX.Element|null}
 */
export function DayProgressDialog({ open, onOpenChange, dateKey, entries, tasksById, assignmentsById }) {
    if (!dateKey) return null;

    const label = new Date(`${dateKey}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={label}>
            {entries.length === 0 ? (
                <EmptyState icon={CalendarX} title="Nothing happened this day" description="No task or assignment activity was recorded." />
            ) : (
                <ul className="space-y-2">
                    {entries.map((entry) => {
                        const meta = ACTIVITY_META[entry.type] ?? { label: entry.type.toLowerCase(), icon: CheckCircle2, tone: "text-muted-foreground bg-muted" };
                        const Icon = meta.icon;
                        const entityTitle = entry.entityType === "task" ? tasksById[entry.entityId]?.title : assignmentsById[entry.entityId]?.title;
                        const time = new Date(entry.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

                        return (
                            <li key={entry.id} className="flex items-center gap-3 rounded-md border border-border/60 p-2.5 text-sm">
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
        </ResponsiveDialog>
    );
}