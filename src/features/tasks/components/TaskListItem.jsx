import { Link } from "@tanstack/react-router";
import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-status-progress/15 text-status-progress",
    high: "bg-destructive/15 text-destructive",
};

const PRIORITY_DOT = {
    low: "bg-muted-foreground/50",
    medium: "bg-status-progress",
    high: "bg-destructive",
};

export function TaskListItem({ task, index, total, prerequisiteCount, onMoveUp, onMoveDown, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="flex flex-col">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === 0} onClick={() => onMoveUp(task)} aria-label="Move up">
                    <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={index === total - 1} onClick={() => onMoveDown(task)} aria-label="Move down">
                    <ChevronDown className="h-4 w-4" />
                </Button>
            </div>

            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                {index + 1}
            </div>

            <Link to={ROUTES.ADMIN_TASK_DETAILS(task.id)} className="min-w-0 flex-1 hover:underline">
                <p className="truncate font-medium">{task.title}</p>
                {task.description && <p className="truncate text-sm text-muted-foreground">{task.description}</p>}
            </Link>

            {prerequisiteCount > 0 && (
                <span className="hidden shrink-0 text-xs text-muted-foreground sm:inline">
                    {prerequisiteCount} prereq{prerequisiteCount > 1 ? "s" : ""}
                </span>
            )}

            <span
                aria-hidden
                title={task.priority}
                className={cn("h-2 w-2 shrink-0 rounded-full sm:hidden", PRIORITY_DOT[task.priority])}
            />
            <span
                className={cn(
                    "hidden shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize sm:inline-block",
                    PRIORITY_STYLES[task.priority]
                )}
            >
                {task.priority}
            </span>

            <div className="flex shrink-0 items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => onEdit(task)} aria-label="Edit task">
                    <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(task)} aria-label="Delete task">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}