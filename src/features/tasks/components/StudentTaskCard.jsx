import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Student task card. Unlocked cards lift and gain shadow on hover;
 * locked cards stay flat and desaturated by design — the visual
 * difference between "you can act on this" and "you can't yet" should
 * be obvious without reading the badge.
 *
 * @param {Object} props
 * @param {Object} props.task - Task with `derivedStatus`.
 * @param {number} props.index
 * @returns {JSX.Element}
 */
export function StudentTaskCard({ task, index }) {
    const locked = task.derivedStatus === "locked";

    const content = (
        <div
            className={cn(
                "flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 transition-all duration-base ease-trail",
                locked ? "opacity-60" : "shadow-[var(--shadow-sm)] hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
            )}
        >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium text-muted-foreground">
                {index + 1}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{task.title}</p>
                {task.description && <p className="truncate text-sm text-muted-foreground">{task.description}</p>}
            </div>
            {locked ? <Lock className="h-4 w-4 shrink-0 text-muted-foreground" /> : <StatusBadge status={task.derivedStatus} />}
        </div>
    );

    if (locked) return content;

    return (
        <Link to={ROUTES.STUDENT_TASK_DETAILS(task.id)} className="block">
            {content}
        </Link>
    );
}