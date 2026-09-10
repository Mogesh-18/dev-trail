import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import {
    calculateOverallProgress, calculateAssignmentCompletionRate, calculateStreak, calculateVelocity, findDelayedTasks,
    summarizeCounts,
} from "@/features/progress/services/insights.service";

/**
 * Full progress stat grid — StatCard now handles the pre-formatted
 * strings this page always passed ("72%", "5 / 12") directly, plus a
 * `hint` for the two cards that need extra context without cluttering
 * the card body (native tooltip on hover).
 *
 * @returns {JSX.Element}
 */
export default function AdminProgressPage() {
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
    const { data: activity, isLoading: activityLoading } = useActivity(50);

    const isLoading = tasksLoading || assignmentsLoading || progressLoading || activityLoading;

    const tasksById = useMemo(() => Object.fromEntries((tasks ?? []).map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries((assignments ?? []).map((a) => [a.id, a])), [assignments]);

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

    const stats = [
        { key: "overall", label: "Overall progress", value: `${overallProgress}%`, tone: "primary" },
        { key: "completed", label: "Tasks completed", value: `${counts.completed} / ${counts.total}`, tone: "primary" },
        { key: "assignmentRate", label: "Assignment completion", value: `${assignmentRate}%`, tone: "secondary" },
        { key: "streak", label: "Current streak", value: `${streak}d`, tone: "accent" },
        { key: "inProgress", label: "In progress", value: counts.inProgress, tone: "secondary" },
        { key: "remaining", label: "Remaining", value: counts.remaining, tone: "secondary" },
        { key: "velocity", label: "Velocity", value: `${velocity}/day`, hint: "Tasks completed per day, last 14 days", tone: "primary" },
        { key: "delayed", label: "Delayed tasks", value: delayedTasks.length, hint: delayedTasks.length ? delayedTasks.map((t) => t.title).join(", ") : "None", tone: "accent" },
    ];

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
                <p className="text-muted-foreground">Derived entirely from stored task and activity data.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={stat.key} style={{ animationDelay: `${i * 50}ms` }} className="duration-slow animate-in fade-in slide-in-from-bottom-2 fill-mode-both">
                        <StatCard label={stat.label} value={stat.value} hint={stat.hint} tone={stat.tone} />
                    </div>
                ))}
            </div>

            <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                <h2 className="font-medium">Recent activity</h2>
                <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} />
            </section>
        </div>
    );
}