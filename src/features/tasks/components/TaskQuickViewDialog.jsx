import { Link as RouterLink } from "@tanstack/react-router";
import { ExternalLink, FileText, StickyNote, Info, Link2 } from "lucide-react";
import { ResponsiveDialog } from "@/components/common/ResponsiveDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ReportsSection } from "@/features/reports/components/ReportsSection";
import { NotesSection } from "@/features/notes/components/NotesSection";
import { TaskLinksSection } from "@/features/tasks/components/TaskLinksSection";
import { useStartTask, useCompleteTask, useReopenTask } from "@/features/progress/hooks/useProgress";
import { TASK_STATUS } from "@/constants/statuses";
import { ROUTES } from "@/constants/routes";

/**
 * Tabbed quick-view for a task. For students, a status-action footer
 * (Start / Mark complete / Reopen) is now included — the same mutations
 * StudentTaskDetailsPage uses — so acting on a task no longer requires
 * leaving the list. The full detail page is untouched and still
 * reachable via "Open full page".
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {(open: boolean) => void} props.onOpenChange
 * @param {Object|null} props.task
 * @param {string|null} [props.status] - Derived status; student callers pass task.derivedStatus.
 * @param {'admin'|'student'} [props.mode='student']
 * @returns {JSX.Element|null}
 */
export function TaskQuickViewDialog({ open, onOpenChange, task, status, mode = "student" }) {
    const startTask = useStartTask();
    const completeTask = useCompleteTask();
    const reopenTask = useReopenTask();

    if (!task) return null;

    const detailRoute = mode === "admin" ? ROUTES.ADMIN_TASK_DETAILS(task.id) : ROUTES.STUDENT_TASK_DETAILS(task.id);
    const showActions = mode === "student" && status;

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange} title={task.title} contentClassName="sm:max-w-xl">
            <div className="mb-3 flex items-center justify-between gap-2">
                {status && <StatusBadge status={status} />}
                <RouterLink
                    to={detailRoute}
                    onClick={() => onOpenChange(false)}
                    className="ml-auto inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                    Open full page
                    <ExternalLink className="h-3 w-3" />
                </RouterLink>
            </div>

            <Tabs defaultValue="details">
                <TabsList className="w-full">
                    <TabsTrigger value="details" className="gap-1.5">
                        <Info className="h-3.5 w-3.5" />
                        Details
                    </TabsTrigger>
                    <TabsTrigger value="links" className="gap-1.5">
                        <Link2 className="h-3.5 w-3.5" />
                        Links
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        Reports
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="gap-1.5">
                        <StickyNote className="h-3.5 w-3.5" />
                        Notes
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="max-h-[50vh] space-y-3 overflow-y-auto py-1">
                    {task.description && <p className="text-sm text-muted-foreground">{task.description}</p>}
                    {task.instructions && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground">Instructions</h3>
                            <p className="whitespace-pre-wrap text-sm">{task.instructions}</p>
                        </div>
                    )}
                    {task.completionCriteria && (
                        <div className="space-y-1">
                            <h3 className="text-xs font-medium text-muted-foreground">Completion criteria</h3>
                            <p className="whitespace-pre-wrap text-sm">{task.completionCriteria}</p>
                        </div>
                    )}
                    {!task.description && !task.instructions && !task.completionCriteria && (
                        <p className="text-sm text-muted-foreground">Nothing added yet.</p>
                    )}
                </TabsContent>

                <TabsContent value="links" className="max-h-[50vh] overflow-y-auto py-1">
                    <TaskLinksSection taskId={task.id} canManage={mode === "admin"} />
                </TabsContent>

                <TabsContent value="reports" className="max-h-[50vh] overflow-y-auto py-1">
                    <ReportsSection taskId={task.id} mode={mode} />
                </TabsContent>

                <TabsContent value="notes" className="max-h-[50vh] overflow-y-auto py-1">
                    <NotesSection contextType="task" contextId={task.id} />
                </TabsContent>
            </Tabs>

            {showActions && (
                <div className="mt-4 flex gap-2 border-t border-border/60 pt-4">
                    {status === TASK_STATUS.AVAILABLE && (
                        <Button onClick={() => startTask.mutate(task.id)} disabled={startTask.isPending}>
                            {startTask.isPending ? "Starting…" : "Start task"}
                        </Button>
                    )}
                    {status === TASK_STATUS.IN_PROGRESS && (
                        <Button onClick={() => completeTask.mutate(task.id)} disabled={completeTask.isPending}>
                            {completeTask.isPending ? "Saving…" : "Mark complete"}
                        </Button>
                    )}
                    {status === TASK_STATUS.COMPLETED && (
                        <Button variant="outline" onClick={() => reopenTask.mutate(task.id)} disabled={reopenTask.isPending}>
                            Reopen task
                        </Button>
                    )}
                </div>
            )}
        </ResponsiveDialog>
    );
}