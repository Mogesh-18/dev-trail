import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/common/StatCard";
import { ActivityTimeline } from "@/features/progress/components/ActivityTimeline";
import { useTasks, useTaskDependencies } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { useAllNotesPaginated } from "@/features/notes/hooks/useNotes";
import { deriveTaskStatuses } from "@/features/tasks/services/task-availability.service";
import {
    calculateOverallProgress,
    calculateAssignmentCompletionRate,
    calculateStreak,
    calculateVelocity,
    summarizeCounts,
} from "@/features/progress/services/insights.service";
import { TASK_STATUS, ASSIGNMENT_STATUS } from "@/constants/statuses";
import { ROUTES } from "@/constants/routes";
import { formatRelativeTime } from "@/utils/format-date";

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

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">Admin dashboard</h1>
                <p className="text-muted-foreground">How the learning path is going.</p>
            </div>

            <div className="space-y-2 rounded-lg border bg-card p-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Student's overall progress</span>
                    <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Current task</p>
                    {currentTask ? (
                        <Link to={ROUTES.ADMIN_TASK_DETAILS(currentTask.id)} className="mt-1 block font-medium hover:underline">
                            {currentTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Nothing in progress right now.</p>
                    )}
                </div>
                <div className="rounded-lg border bg-card p-4">
                    <p className="text-sm text-muted-foreground">Next recommended task</p>
                    {nextTask ? (
                        <Link to={ROUTES.ADMIN_TASK_DETAILS(nextTask.id)} className="mt-1 block font-medium hover:underline">
                            {nextTask.title}
                        </Link>
                    ) : (
                        <p className="mt-1 text-sm text-muted-foreground">Nothing available yet.</p>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Total tasks" value={counts.total} />
                <StatCard label="Tasks completed" value={counts.completed} />
                <StatCard label="In progress" value={counts.inProgress} />
                <StatCard label="Upcoming" value={counts.remaining - counts.inProgress} />
                <StatCard label="Total assignments" value={assignments.length} />
                <StatCard label="Assignment completion" value={`${assignmentRate}%`} />
                <StatCard label="Pending review" value={pendingAssignments} />
                <StatCard label="Learning streak" value={`${streak}d`} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <section className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                        <h2 className="font-medium">Recent activity</h2>
                        <Link to={ROUTES.ADMIN_PROGRESS} className="text-xs text-primary hover:underline">
                            View all
                        </Link>
                    </div>
                    <ActivityTimeline tasksById={tasksById} assignmentsById={assignmentsById} pageSize={5} />
                </section>

                <section className="space-y-3 rounded-lg border p-4">
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
                                    <li key={note.id} className="text-sm">
                                        <p className="truncate text-muted-foreground">{entityTitle ?? note.contextType}</p>
                                        <p className="line-clamp-2">{note.body}</p>
                                        <p className="text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </section>
            </div>

            <p className="text-sm text-muted-foreground">
                Velocity: {velocity} task{velocity === 1 ? "" : "s"}/day (trailing 14 days)
            </p>
        </div>
    );
}