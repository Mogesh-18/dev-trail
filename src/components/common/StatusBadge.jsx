import { cn } from "@/lib/utils";

/**
 * Single source of truth for every status pill in the app (task and
 * assignment statuses share this component). Each status maps to a
 * trail-state color, a small dot, and a readable label — unknown
 * statuses fall back to a humanized version of the raw string instead
 * of rendering blank.
 */
const STATUS_META = {
    locked: { label: "Locked", dot: "bg-status-locked", text: "text-status-locked", bg: "bg-status-locked/12" },
    available: { label: "Available", dot: "bg-status-available", text: "text-status-available", bg: "bg-status-available/12" },
    in_progress: { label: "In Progress", dot: "bg-status-progress", text: "text-status-progress", bg: "bg-status-progress/12" },
    completed: { label: "Completed", dot: "bg-status-completed", text: "text-status-completed", bg: "bg-status-completed/12" },
    skipped: { label: "Skipped", dot: "bg-status-skipped", text: "text-status-skipped", bg: "bg-status-skipped/12" },
    not_started: { label: "Not Started", dot: "bg-status-locked", text: "text-status-locked", bg: "bg-status-locked/12" },
    submitted: { label: "Submitted", dot: "bg-status-progress", text: "text-status-progress", bg: "bg-status-progress/12" },
    under_review: { label: "Under Review", dot: "bg-status-progress", text: "text-status-progress", bg: "bg-status-progress/12" },
    changes_requested: { label: "Changes Requested", dot: "bg-accent", text: "text-accent", bg: "bg-accent/12" },
};

function humanize(status) {
    return String(status).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Status pill — a soft-tinted badge with a small dot, animated with a
 * gentle pulse only for "in progress"/"submitted"/"under review" (the
 * states where something is actively awaited), so movement itself
 * signals "this one needs attention."
 *
 * @param {Object} props
 * @param {string} props.status
 * @returns {JSX.Element}
 */
export function StatusBadge({ status }) {
    const meta = STATUS_META[status] ?? { label: humanize(status), dot: "bg-muted-foreground", text: "text-muted-foreground", bg: "bg-muted" };
    const isActive = status === "in_progress" || status === "submitted" || status === "under_review";

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-transform duration-fast ease-spring",
                meta.bg,
                meta.text
            )}
        >
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot, isActive && "animate-pulse-glow")} />
            {meta.label}
        </span>
    );
}