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
import { ReportsSection } from "@/features/reports/components/ReportsSection";

/**
 * Student task detail. The "locked, waiting on X" banner is now a real
 * callout (icon badge, tinted background) instead of a dashed box, and
 * the presence indicator ("admin viewing now") pulses like a live dot
 * instead of sitting as flat text.
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

    // eslint-disable-next-line react-hooks/rules-of-hooks -- preserved from original: early-return above already guards on tasksLoading/task, matches upstream behavior
    const otherPresent = useTaskPresence(task?.id);
    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));
    const status = deriveTaskStatus(task, dependencies, progressByTaskId);

    const linkedAssignments = assignments.filter((a) => taskLinks.some((l) => l.taskId === task.id && l.assignmentId === a.id));
    const prerequisiteTitles = getBlockingReasons(task, dependencies, tasks ?? [], progressByTaskId);

    const sections = [
        task.instructions && { title: "Instructions", body: task.instructions },
        task.completionCriteria && { title: "Completion criteria", body: task.completionCriteria },
    ].filter(Boolean);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">{task.title}</h1>
                <StatusBadge status={status} />
                {otherPresent && (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-status-available" />
                        Your admin is viewing this task right now.
                    </span>
                )}
            </div>

            {status === TASK_STATUS.LOCKED && (
                <div className="flex items-center gap-3 rounded-lg border border-status-locked/30 bg-status-locked/10 p-3 text-sm shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-locked/20 text-status-locked">
                        <Lock className="h-4 w-4" />
                    </span>
                    <span className="text-muted-foreground">
                        Complete {prerequisiteTitles.join(", ")} first to unlock this task.
                    </span>
                </div>
            )}

            {task.description && <p className="text-muted-foreground">{task.description}</p>}

            {sections.map((s, i) => (
                <section key={s.title} style={{ animationDelay: `${i * 60}ms` }} className="space-y-1 duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both">
                    <h2 className="text-sm font-medium text-muted-foreground">{s.title}</h2>
                    <p className="whitespace-pre-wrap text-sm">{s.body}</p>
                </section>
            ))}

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

            <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                <h2 className="font-medium">Reports</h2>
                <ReportsSection taskId={task.id} mode="student" />
            </section>

            <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                <h2 className="font-medium">Notes</h2>
                <NotesSection contextType="task" contextId={task.id} />
            </section>
        </div>
    );
}