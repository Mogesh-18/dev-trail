import { cn } from "@/lib/utils";
import { TASK_STATUS_COLOR } from "@/constants/statuses";

const LABELS = {
    locked: "Locked",
    available: "Available",
    in_progress: "In progress",
    completed: "Completed",
    skipped: "Skipped",
    not_started: "Not started",
    submitted: "Submitted",
    under_review: "Under review",
    changes_requested: "Changes requested",
};

export function StatusBadge({ status, className }) {
    const colorToken = TASK_STATUS_COLOR[status];
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                colorToken ? "text-white" : "bg-muted text-muted-foreground",
                className
            )}
            style={colorToken ? { backgroundColor: `hsl(var(--${colorToken}))` } : undefined}
        >
            {LABELS[status] ?? status}
        </span>
    );
}