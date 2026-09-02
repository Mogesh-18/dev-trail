import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/common/StatCard";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { deriveTaskStatuses } from "@/features/tasks/services/task-availability.service";
import { calculateOverallProgress, calculateStreak, summarizeCounts } from "@/features/progress/services/insights.service";
import { TASK_STATUS } from "@/constants/statuses";
import { ROUTES } from "@/constants/routes";

export default function StudentDashboardPage() {
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: assignments } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
    // 50, not the widget's own display page size — streak/velocity need
    // enough history to scan correctly regardless of what's rendered below.
    const { data: activity, isLoading: activityLoading } = useActivity(50);

    const tasksById = useMemo(() => Object.fromEntries((tasks ?? []).map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries((assignments ?? []).map((a) => [a.id, a])), [assignments]);

    if (tasksLoading || progressLoading || activityLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));
    const statuses = deriveTaskStatuses(tasks, dependencies, progressByTaskId);
    const orderedTasks = [...tasks].sort((a, b) => a.orderIndex - b.orderIndex);

    const currentTask = orderedTasks.find((t) => statuses[t.id] === TASK_STATUS.IN_PROGRESS);
    const nextTask = orderedTasks.find((t) => statuses[t.id] === TASK_STATUS.AVAILABLE);
    const counts = summarizeCounts(tasks, progress);
    const overallProgress = calculateOverallProgress(tasks, progress);
    const streak = calculateStreak(activity);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Welcome back</h1>
                <p className="text-muted-foreground">Here's where things stand.</p>
            </div>

            <div className="space-y-2 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall progress</span>
                    <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Current task</p>
                    {currentTask ? (
                        <Link to={ROUTES.STUDENT_TASK_DETAILS(currentTask.id)} className="mt-1 block font-medium hover:underline">
                            {currentTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Nothing in progress right now.</p>
                    )}
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Next up</p>
                    {nextTask ? (
                        <Link to={ROUTES.STUDENT_TASK_DETAILS(nextTask.id)} className="mt-1 block font-medium hover:underline">
                            {nextTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">You're all caught up.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Completed" value={counts.completed} />
                <StatCard label="In progress" value={counts.inProgress} />
                <StatCard label="Remaining" value={counts.remaining} />
                <StatCard label="Streak" value={`${streak}d`} />
            </div>

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Recent activity</h2>
                <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} pageSize={5} />
            </section>
        </div>
    );
}