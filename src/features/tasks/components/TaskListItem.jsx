import { useState } from "react";
import { ChevronUp, ChevronDown, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskQuickViewDialog } from "@/features/tasks/components/TaskQuickViewDialog";
import { cn } from "@/lib/utils";

/**
 * Tailwind CSS classes for priority badges (text and background).
 * 
 * @type {Record<'low'|'medium'|'high', string>}
 */
const PRIORITY_STYLES = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-status-progress/15 text-status-progress",
    high: "bg-destructive/15 text-destructive",
};

/**
 * Tailwind CSS classes for priority dots (small coloured circles).
 * 
 * @type {Record<'low'|'medium'|'high', string>}
 */
const PRIORITY_DOT = {
    low: "bg-muted-foreground/50",
    medium: "bg-status-progress",
    high: "bg-destructive",
};

/**
 * Admin task row. Clicking the title (or the new "eye" button) opens
 * the tabbed TaskQuickViewDialog instead of navigating away — Edit,
 * Delete, and reorder stay as direct row actions since those are
 * single-purpose, but "view details/links/reports/notes" now happens
 * without leaving the list.
 *
 * @param {Object} props
 * @param {Object} props.task
 * @param {number} props.index
 * @param {number} props.total
 * @param {number} props.prerequisiteCount
 * @param {(task: Object) => void} props.onMoveUp
 * @param {(task: Object) => void} props.onMoveDown
 * @param {(task: Object) => void} props.onEdit
 * @param {(task: Object) => void} props.onDelete
 * @returns {JSX.Element}
 */
export function TaskListItem({ task, index, total, prerequisiteCount, onMoveUp, onMoveDown, onEdit, onDelete }) {
    const [quickViewOpen, setQuickViewOpen] = useState(false);

    return (
        <>
            <div className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail hover:border-primary/20 hover:shadow-[var(--shadow-md)]">
                <div className="flex flex-col">
                    <Button variant="ghost" size="icon" className="h-8 w-8 transition-transform duration-fast ease-spring hover:scale-110 disabled:hover:scale-100" disabled={index === 0} onClick={() => onMoveUp(task)} aria-label="Move up">
                        <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 transition-transform duration-fast ease-spring hover:scale-110 disabled:hover:scale-100" disabled={index === total - 1} onClick={() => onMoveDown(task)} aria-label="Move down">
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted font-mono text-xs font-medium text-muted-foreground">
                    {index + 1}
                </div>

                <button type="button" onClick={() => setQuickViewOpen(true)} className="min-w-0 flex-1 text-left">
                    <p className="truncate font-medium transition-colors duration-fast group-hover:text-primary">{task.title}</p>
                    {task.description && <p className="truncate text-sm text-muted-foreground">{task.description}</p>}
                </button>

                {prerequisiteCount > 0 && (
                    <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                        {prerequisiteCount} prereq{prerequisiteCount > 1 ? "s" : ""}
                    </span>
                )}

                <span aria-hidden title={task.priority} className={cn("h-2 w-2 shrink-0 rounded-full sm:hidden", PRIORITY_DOT[task.priority])} />
                <span className={cn("hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize sm:inline-block", PRIORITY_STYLES[task.priority])}>
                    {task.priority}
                </span>

                <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity duration-fast group-hover:opacity-100">
                    <Button variant="ghost" size="icon" onClick={() => setQuickViewOpen(true)} aria-label="View task">
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:text-destructive" onClick={() => onDelete(task)} aria-label="Delete task">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <TaskQuickViewDialog open={quickViewOpen} onOpenChange={setQuickViewOpen} task={task} mode="admin" />
        </>
    );
}