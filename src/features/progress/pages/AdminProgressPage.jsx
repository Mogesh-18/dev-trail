import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import {
    calculateOverallProgress,
    calculateAssignmentCompletionRate,
    calculateStreak,
    calculateVelocity,
    findDelayedTasks,
    summarizeCounts,
} from "@/features/progress/services/insights.service";

export default function AdminProgressPage() {
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
    const { data: activity, isLoading: activityLoading } = useActivity();

    const isLoading = tasksLoading || assignmentsLoading || progressLoading || activityLoading;

    const tasksById = useMemo(() => Object.fromEntries((tasks ?? []).map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(
        () => Object.fromEntries((assignments ?? []).map((a) => [a.id, a])),
        [assignments]
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
        );
    }

    const counts = summarizeCounts(tasks, progress);
    const overallProgress = calculateOverallProgress(tasks, progress);
    const assignmentRate = calculateAssignmentCompletionRate(assignments);
    const streak = calculateStreak(activity);
    const velocity = calculateVelocity(activity);
    const delayedTasks = findDelayedTasks(tasks, progress);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Progress</h1>
                <p className="text-muted-foreground">Derived entirely from stored task and activity data.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Overall progress" value={`${overallProgress}%`} />
                <StatCard label="Tasks completed" value={`${counts.completed} / ${counts.total}`} />
                <StatCard label="Assignment completion" value={`${assignmentRate}%`} />
                <StatCard label="Current streak" value={`${streak}d`} />
                <StatCard label="In progress" value={counts.inProgress} />
                <StatCard label="Remaining" value={counts.remaining} />
                <StatCard label="Velocity" value={`${velocity}/day`} hint="Tasks completed per day, last 14 days" />
                <StatCard
                    label="Delayed tasks"
                    value={delayedTasks.length}
                    hint={delayedTasks.length ? delayedTasks.map((t) => t.title).join(", ") : "None"}
                />
            </div>

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Recent activity</h2>
                <ActivityTimeline activity={activity} tasksById={tasksById} assignmentsById={assignmentsById} />
            </section>
        </div>
    );
}