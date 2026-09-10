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

/**
 * Student dashboard — same choreography standard as the admin one:
 * staggered stat grid, hover-lift task cards, glow progress bar.
 *
 * @returns {JSX.Element}
 */
export default function StudentDashboardPage() {
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: assignments } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
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

    const stats = [
        { key: "completed", label: "Completed", value: counts.completed, tone: "primary" },
        { key: "inProgress", label: "In progress", value: counts.inProgress, tone: "secondary" },
        { key: "remaining", label: "Remaining", value: counts.remaining, tone: "secondary" },
        { key: "streak", label: "Streak", value: streak, tone: "accent" },
    ];

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground">Here's where things stand.</p>
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall progress</span>
                    <span className="font-mono text-sm font-semibold text-primary">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2.5" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 hover:-translate-y-px hover:shadow-[var(--shadow-md)]">
                    <p className="text-sm text-muted-foreground">Current task</p>
                    {currentTask ? (
                        <Link to={ROUTES.STUDENT_TASK_DETAILS(currentTask.id)} className="mt-1 block font-medium text-primary hover:underline">
                            {currentTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Nothing in progress right now.</p>
                    )}
                </div>
                <div
                    style={{ animationDelay: "60ms" }}
                    className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
                >
                    <p className="text-sm text-muted-foreground">Next up</p>
                    {nextTask ? (
                        <Link to={ROUTES.STUDENT_TASK_DETAILS(nextTask.id)} className="mt-1 block font-medium text-primary hover:underline">
                            {nextTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">You're all caught up.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat, i) => (
                    <div
                        key={stat.key}
                        className="duration-slow animate-in fade-in slide-in-from-bottom-2 fill-mode-both"
                        style={{ animationDelay: `${i * 60}ms` }}
                    >
                        <StatCard label={stat.label} value={stat.value} tone={stat.tone} />
                    </div>
                ))}
            </div>

            <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                <h2 className="font-medium">Recent activity</h2>
                <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} pageSize={5} />
            </section>
        </div>
    );
}