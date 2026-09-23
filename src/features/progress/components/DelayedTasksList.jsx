import { AlertOctagon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { EmptyState } from "@/components/common/EmptyState";
import { ROUTES } from "@/constants/routes";

/**
 * Delayed tasks as a real list instead of a tooltip hint you had to
 * hover a stat card to discover.
 *
 * @param {Object} props
 * @param {Array} props.tasks
 * @returns {JSX.Element}
 */
export function DelayedTasksList({ tasks }) {
    return (
        <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
            <h3 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <AlertOctagon className="h-3.5 w-3.5" />
                Delayed tasks
            </h3>
            {tasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nothing's behind schedule.</p>
            ) : (
                <ul className="space-y-2">
                    {tasks.map((t) => (
                        <li key={t.id}>
                            <Link
                                to={ROUTES.ADMIN_TASK_DETAILS(t.id)}
                                className="flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 p-2.5 text-sm transition-all duration-fast hover:border-destructive/40 hover:shadow-[var(--shadow-sm)]"
                            >
                                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                                <span className="truncate">{t.title}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}