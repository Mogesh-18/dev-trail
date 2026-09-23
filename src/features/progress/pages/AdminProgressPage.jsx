import { useMemo } from "react";
import { Flame, Gauge } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/common/StatCard";
import { CompletionRing } from "@/features/progress/components/CompletionRing";
import { TaskAssignmentBars } from "@/features/progress/components/TaskAssignmentBars";
import { DelayedTasksList } from "@/features/progress/components/DelayedTasksList";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import {
    calculateOverallProgress, calculateAssignmentCompletionRate, calculateStreak, calculateVelocity, findDelayedTasks,
    summarizeCounts,
} from "@/features/progress/services/insights.service";
import { ASSIGNMENT_STATUS } from "@/constants/statuses";

/**
 * Progress page rebuilt around actual visuals instead of eight
 * identical stat cards on their own: a hero row (completion ring +
 * streak/velocity), a completion-by-type comparison bar chart, a real
 * delayed-tasks list, and activity — each section earns its own
 * visual weight instead of everything being the same StatCard shape.
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
    const completedAssignments = assignments.filter((a) => a.status === ASSIGNMENT_STATUS.COMPLETED).length;

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Progress</h1>
                <p className="text-muted-foreground">Derived entirely from stored task and activity data.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1 sm:col-span-1">
                    <CompletionRing percent={overallProgress} size={72} strokeWidth={7} />
                    <div>
                        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Gauge className="h-3.5 w-3.5" />
                            Overall progress
                        </p>
                        <p className="mt-1 font-mono text-lg font-semibold">{counts.completed} / {counts.total}</p>
                        <p className="text-xs text-muted-foreground">tasks completed</p>
                    </div>
                </div>

                <div
                    style={{ animationDelay: "60ms" }}
                    className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <Flame className="h-6 w-6" />
                    </span>
                    <div>
                        <p className="text-xs text-muted-foreground">Current streak</p>
                        <p className="font-mono text-2xl font-semibold">{streak}<span className="text-sm text-muted-foreground">d</span></p>
                    </div>
                </div>

                <div
                    style={{ animationDelay: "120ms" }}
                    className="grid grid-cols-2 gap-4 rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                >
                    <div>
                        <p className="text-xs text-muted-foreground">Velocity</p>
                        <p className="font-mono text-xl font-semibold">{velocity}<span className="text-sm text-muted-foreground">/day</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                        <p className="font-mono text-xl font-semibold">{counts.inProgress}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <TaskAssignmentBars
                    tasks={{ completed: counts.completed, total: counts.total }}
                    assignments={{ completed: completedAssignments, total: assignments.length }}
                />
                <DelayedTasksList tasks={delayedTasks} />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Remaining" value={counts.remaining} tone="secondary" />
                <StatCard label="Assignment completion" value={`${assignmentRate}%`} tone="secondary" />
                <StatCard label="Pending review" value={assignments.filter((a) => a.status === ASSIGNMENT_STATUS.SUBMITTED || a.status === ASSIGNMENT_STATUS.UNDER_REVIEW).length} tone="accent" />
                <StatCard label="Total assignments" value={assignments.length} tone="secondary" />
            </div>

            <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                <h2 className="font-medium">Recent activity</h2>
                <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} />
            </section>
        </div>
    );
}