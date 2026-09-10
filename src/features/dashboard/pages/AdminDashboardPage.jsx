import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { CalendarDays, Flame } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { useAllNotesPaginated } from "@/features/notes/hooks/useNotes";
import { deriveTaskStatuses } from "@/features/tasks/services/task-availability.service";
import {
    calculateOverallProgress, calculateAssignmentCompletionRate, calculateStreak, calculateVelocity, summarizeCounts,
} from "@/features/progress/services/insights.service";
import { TASK_STATUS, ASSIGNMENT_STATUS } from "@/constants/statuses";
import { ROUTES } from "@/constants/routes";
import { formatRelativeTime } from "@/utils/format-date";
import { DraggableStatGrid } from "@/components/common/DraggableStatGrid";

/**
 * Admin dashboard. Progress bar sits in a glowing "trail marker" card,
 * current/next task cards lift on hover, and everything staggers in
 * on load instead of appearing as one flat block.
 *
 * @returns {JSX.Element}
 */
export default function AdminDashboardPage() {
    const { data: tasks, isLoading: tasksLoading } = useTasks();
    const { data: dependencies = [] } = useTaskDependencies();
    const { data: assignments, isLoading: assignmentsLoading } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
    const { data: activity = [], isLoading: activityLoading } = useActivity(50);
    const { items: recentNotes, isLoading: notesLoading } = useAllNotesPaginated(3);

    const tasksById = useMemo(() => Object.fromEntries((tasks ?? []).map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries((assignments ?? []).map((a) => [a.id, a])), [assignments]);

    const isLoading = tasksLoading || assignmentsLoading || progressLoading || activityLoading;

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                ))}
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
    const assignmentRate = calculateAssignmentCompletionRate(assignments);
    const pendingAssignments = assignments.filter(
        (a) => a.status === ASSIGNMENT_STATUS.SUBMITTED || a.status === ASSIGNMENT_STATUS.UNDER_REVIEW
    ).length;
    const streak = calculateStreak(activity);
    const velocity = calculateVelocity(activity);

    const statItems = [
        { key: "total", label: "Total tasks", value: counts.total },
        { key: "completed", label: "Tasks completed", value: counts.completed },
        { key: "inProgress", label: "In progress", value: counts.inProgress },
        { key: "upcoming", label: "Upcoming", value: counts.remaining - counts.inProgress },
        { key: "totalAssignments", label: "Total assignments", value: assignments.length },
        { key: "assignmentRate", label: "Assignment completion", value: assignmentRate },
        { key: "pending", label: "Pending review", value: pendingAssignments },
        { key: "streak", label: "Learning streak", value: streak },
    ];

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Admin dashboard</h1>
                <p className="text-muted-foreground">How the learning path is going.</p>
                <Link to={ROUTES.ADMIN_TIMELINE} className="mt-1 inline-flex items-center gap-1.5 text-sm text-primary transition-transform duration-fast hover:translate-x-0.5 hover:underline">
                    <CalendarDays className="h-4 w-4" />
                    View timeline & pacing
                </Link>
            </div>

            <div className="space-y-2 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Student's overall progress</span>
                    <span className="font-mono text-sm font-semibold text-primary">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="h-2.5" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div
                    className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 hover:-translate-y-px hover:shadow-[var(--shadow-md)]"
                >
                    <p className="text-sm text-muted-foreground">Current task</p>
                    {currentTask ? (
                        <Link to={ROUTES.ADMIN_TASK_DETAILS(currentTask.id)} className="mt-1 block font-medium text-primary hover:underline">
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
                    <p className="text-sm text-muted-foreground">Next recommended task</p>
                    {nextTask ? (
                        <Link to={ROUTES.ADMIN_TASK_DETAILS(nextTask.id)} className="mt-1 block font-medium text-primary hover:underline">
                            {nextTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Nothing available yet.</p>
                    )}
                </div>
            </div>

            <DraggableStatGrid storageKey="devtrail-admin-stat-order" items={statItems} />

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Recent activity</h2>
                        <Link to={ROUTES.ADMIN_PROGRESS} className="text-xs text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} pageSize={5} />
                </section>

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Recent notes</h2>
                        <Link to={ROUTES.ADMIN_NOTES} className="text-xs text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    {notesLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
                    {!notesLoading && recentNotes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}
                    {!notesLoading && recentNotes.length > 0 && (
                        <ul className="space-y-2">
                            {recentNotes.map((note) => {
                                const entityTitle =
                                    note.contextType === "task" ? tasksById[note.contextId]?.title : assignmentsById[note.contextId]?.title;
                                return (
                                    <li key={note.id} className="rounded-md p-2 text-sm transition-colors duration-fast hover:bg-muted">
                                        <p className="truncate text-muted-foreground">{entityTitle ?? note.contextType}</p>
                                        <p className="line-clamp-2">{note.body}</p>
                                        <p className="font-mono text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>

            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Flame className="h-4 w-4 text-accent" />
                Velocity: <span className="font-mono font-medium text-foreground">{velocity}</span> task{velocity === 1 ? "" : "s"}/day (trailing 14 days)
            </p>
        </div>
    );
}