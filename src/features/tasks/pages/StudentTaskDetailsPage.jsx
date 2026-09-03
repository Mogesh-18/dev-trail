import { useParams, Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { NotesSection } from "@/features/notes/components/NotesSection";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useAssignments, useAssignmentTaskLinks } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useStartTask, useCompleteTask, useReopenTask } from "@/features/progress/hooks/useProgress";
import { deriveTaskStatus } from "@/features/tasks/services/task-availability.service";
import { getBlockingReasons } from "@/features/tasks/utils/get-blocking-reasons";
import { useTaskPresence } from "@/features/tasks/hooks/useTaskPresence";
import { TASK_STATUS } from "@/constants/statuses";
import { ROUTES } from "@/constants/routes";

/**
 * Student view for a single task, showing status, related assignments, and actions (start, complete, reopen).
 * 
 * @returns {JSX.Element}
 */
export default function StudentTaskDetailsPage() {
    const { taskId } = useParams({ strict: false });
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: progress = [], isLoading: progressLoading } = useProgress();
    const { data: assignments = [] } = useAssignments();
    const { data: taskLinks = [] } = useAssignmentTaskLinks();

    const startTask = useStartTask();
    const completeTask = useCompleteTask();
    const reopenTask = useReopenTask();

    if (tasksLoading || progressLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    const task = (tasks ?? []).find((t) => t.id === taskId);
    if (!task) return <p className="text-muted-foreground">Task not found.</p>;

    const otherPresent = useTaskPresence(task?.id);
    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));
    const status = deriveTaskStatus(task, dependencies, progressByTaskId);

    const linkedAssignments = assignments.filter((a) =>
        taskLinks.some((l) => l.taskId === task.id && l.assignmentId === a.id)
    );

    const prerequisiteTitles = getBlockingReasons(task, dependencies, tasks ?? [], progressByTaskId);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{task.title}</h1>
                <StatusBadge status={status} />

                {otherPresent && (
                    <p className="text-xs text-muted-foreground">Your admin is viewing this task right now.</p>
                )}
            </div>

            {status === TASK_STATUS.LOCKED && (
                <div className="flex items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    <Lock className="h-4 w-4" />
                    Complete {prerequisiteTitles.join(", ")} first to unlock this task.
                </div>
            )}

            {task.description && <p className="text-muted-foreground">{task.description}</p>}

            {task.instructions && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Instructions</h2>
                    <p className="whitespace-pre-wrap text-sm">{task.instructions}</p>
                </section>
            )}

            {task.completionCriteria && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Completion criteria</h2>
                    <p className="whitespace-pre-wrap text-sm">{task.completionCriteria}</p>
                </section>
            )}

            {linkedAssignments.length > 0 && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Related assignments</h2>
                    <ul className="space-y-1">
                        {linkedAssignments.map((a) => (
                            <li key={a.id}>
                                <Link to={ROUTES.STUDENT_ASSIGNMENT_DETAILS(a.id)} className="text-sm text-primary hover:underline">
                                    {a.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <div className="flex gap-2">
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

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Reports</h2>
                <ReportsSection taskId={task.id} mode="student" />
            </section>

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Notes</h2>
                <NotesSection contextType="task" contextId={task.id} />
            </section>
        </div>
    );
}