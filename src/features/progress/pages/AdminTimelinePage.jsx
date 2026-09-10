import { Link } from "@tanstack/react-router";
import { CalendarClock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ErrorState } from "@/components/common/ErrorState";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { summarizeCounts, calculateVelocity } from "@/features/progress/services/insights.service";
import { groupAssignmentsByWeek, estimateCompletion } from "@/features/progress/services/pacing.service";
import { ROUTES } from "@/constants/routes";

/**
 * Sections for the timeline view, each with a display label.
 * 
 * @type {Array<{ key: 'overdue'|'thisWeek'|'nextWeek'|'later', label: string }>}
 */
const SECTIONS = [
    { key: "overdue", label: "Overdue" },
    { key: "thisWeek", label: "This week" },
    { key: "nextWeek", label: "Next week" },
    { key: "later", label: "Later" },
];

/**
 * Admin timeline. The pacing projection now reads as a real callout
 * (icon badge, primary-tinted card) instead of a plain bordered box,
 * and each week section staggers in.
 *
 * @returns {JSX.Element}
 */
export default function AdminTimelinePage() {
    const { data: tasks, isLoading: tasksLoading, isError: tasksError, refetch: refetchTasks } = useTasks();
    const { data: assignments, isLoading: assignmentsLoading, isError: assignmentsError, refetch: refetchAssignments } = useAssignments();
    const { data: progress, isLoading: progressLoading } = useProgress();
    const { data: activity, isLoading: activityLoading } = useActivity(50);

    const isLoading = tasksLoading || assignmentsLoading || progressLoading || activityLoading;
    const isError = tasksError || assignmentsError;

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorState
                description="Couldn't load the timeline. Check your connection and try again."
                onRetry={() => { refetchTasks(); refetchAssignments(); }}
            />
        );
    }

    const counts = summarizeCounts(tasks, progress);
    const velocity = calculateVelocity(activity);
    const projection = estimateCompletion(counts.remaining, velocity);
    const weeks = groupAssignmentsByWeek(assignments);

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Timeline</h1>
                <p className="text-muted-foreground">Deadlines and pacing, derived from stored dates and recent activity.</p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <CalendarClock className="h-4 w-4" />
                </span>
                <div>
                    <p className="text-sm text-muted-foreground">Pacing</p>
                    {projection ? (
                        <p className="mt-0.5">
                            At the current pace (<span className="font-mono font-medium">{velocity}</span>/day), the remaining{" "}
                            <span className="font-mono font-medium">{counts.remaining}</span> task{counts.remaining === 1 ? "" : "s"} projects to finish around{" "}
                            <span className="font-medium">{projection.projectedDate.toLocaleDateString()}</span> (~{projection.daysRemaining} days).
                        </p>
                    ) : (
                        <p className="mt-0.5 text-sm text-muted-foreground">Not enough recent activity yet to project a pace.</p>
                    )}
                </div>
            </div>

            {SECTIONS.map(({ key, label }, sectionIndex) => (
                <section
                    key={key}
                    style={{ animationDelay: `${sectionIndex * 80}ms` }}
                    className="space-y-2 duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                >
                    <h2 className="text-sm font-medium text-muted-foreground">{label}</h2>
                    {weeks[key].length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nothing here.</p>
                    ) : (
                        <div className="space-y-2">
                            {weeks[key].map((a) => (
                                <Link
                                    key={a.id}
                                    to={ROUTES.ADMIN_ASSIGNMENT_DETAILS(a.id)}
                                    className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium transition-colors duration-fast group-hover:text-primary">{a.title}</p>
                                        <p className="text-sm text-muted-foreground">Due {a.deadline}</p>
                                    </div>
                                    <StatusBadge status={a.status} />
                                </Link>
                            ))}
                        </div>
                    )}
                </section>
            ))}
        </div>
    );
}