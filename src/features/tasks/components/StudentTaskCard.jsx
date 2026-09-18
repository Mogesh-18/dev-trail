import { useState } from "react";
import { Lock } from "lucide-react";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TaskQuickViewDialog } from "@/features/tasks/components/TaskQuickViewDialog";
import { cn } from "@/lib/utils";

/**
 * Student task card. Now opens the tabbed TaskQuickViewDialog on tap
 * instead of navigating straight to the detail page — the dialog's
 * "Open full page" link still gets you there when you want the full
 * page specifically. Locked cards stay inert either way.
 *
 * @param {Object} props
 * @param {Object} props.task - Task with `derivedStatus`.
 * @param {number} props.index
 * @returns {JSX.Element}
 */
export function StudentTaskCard({ task, index }) {
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const locked = task.derivedStatus === "locked";

    return (
        <>
            <button
                type="button"
                onClick={() => !locked && setQuickViewOpen(true)}
                disabled={locked}
                className={cn(
                    "flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card p-3 text-left transition-all duration-base ease-trail",
                    locked ? "cursor-not-allowed opacity-60" : "shadow-[var(--shadow-sm)] hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
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
            </button>

            {!locked && (
                <TaskQuickViewDialog
                    open={quickViewOpen}
                    onOpenChange={setQuickViewOpen}
                    task={task}
                    status={task.derivedStatus}
                    mode="student"
                />
            )}
        </>
    );
}