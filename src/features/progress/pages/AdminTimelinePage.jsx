import { Link } from "@tanstack/react-router";
import { AlertTriangle, CalendarCheck2, CalendarClock, CalendarRange, Gauge } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ErrorState } from "@/components/common/ErrorState";
import { CompletionRing } from "@/features/progress/components/CompletionRing";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { useProgress, useActivity } from "@/features/progress/hooks/useProgress";
import { summarizeCounts, calculateVelocity } from "@/features/progress/services/insights.service";
import { groupAssignmentsByWeek, estimateCompletion } from "@/features/progress/services/pacing.service";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

/**
 * Section metadata — icon + tone per week bucket, so "Overdue" reads
 * urgent (destructive) and "Later" reads calm (muted) at a glance
 * instead of every section looking identical.
 */
const SECTIONS = [
    { key: "overdue", label: "Overdue", icon: AlertTriangle, tone: "destructive" },
    { key: "thisWeek", label: "This week", icon: CalendarCheck2, tone: "primary" },
    { key: "nextWeek", label: "Next week", icon: CalendarClock, tone: "secondary" },
    { key: "later", label: "Later", icon: CalendarRange, tone: "muted" },
];

const TONE_CLASSES = {
    destructive: { icon: "bg-destructive/10 text-destructive", border: "hover:border-destructive/30" },
    primary: { icon: "bg-primary/10 text-primary", border: "hover:border-primary/30" },
    secondary: { icon: "bg-secondary/10 text-secondary", border: "hover:border-secondary/30" },
    muted: { icon: "bg-muted text-muted-foreground", border: "hover:border-border" },
};

/**
 * Admin timeline. Pacing card now shows a completion ring alongside
 * the projection text; each week section gets a colored icon badge,
 * an item-count pill, and a connecting line through its rows (same
 * "checkpoints on a line" language as ActivityTimeline) instead of a
 * plain heading + flat list.
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
    const completionPercent = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Timeline</h1>
                <p className="text-muted-foreground">Deadlines and pacing, derived from stored dates and recent activity.</p>
            </div>

            <div className="flex items-center gap-4 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1">
                <CompletionRing percent={completionPercent} />
                <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Gauge className="h-3.5 w-3.5" />
                        Pacing
                    </p>
                    {projection ? (
                        <p className="mt-0.5 text-sm">
                            At the current pace (<span className="font-mono font-medium">{velocity}</span>/day), the remaining{" "}
                            <span className="font-mono font-medium">{counts.remaining}</span> task{counts.remaining === 1 ? "" : "s"} projects to finish around{" "}
                            <span className="font-medium">{projection.projectedDate.toLocaleDateString()}</span> (~{projection.daysRemaining} days).
                        </p>
                    ) : (
                        <p className="mt-0.5 text-sm text-muted-foreground">Not enough recent activity yet to project a pace.</p>
                    )}
                </div>
            </div>

            {SECTIONS.map(({ key, label, icon: Icon, tone }, sectionIndex) => {
                const items = weeks[key];
                const toneClasses = TONE_CLASSES[tone];

                return (
                    <section
                        key={key}
                        style={{ animationDelay: `${sectionIndex * 80}ms` }}
                        className="space-y-2 duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both"
                    >
                        <div className="flex items-center gap-2">
                            <span className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full", toneClasses.icon)}>
                                <Icon className="h-3.5 w-3.5" />
                            </span>
                            <h2 className="text-sm font-medium">{label}</h2>
                            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
                                {items.length}
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <p className="pl-9 text-sm text-muted-foreground">Nothing here.</p>
                        ) : (
                            <div className="relative space-y-2 pl-9">
                                <div className="pointer-events-none absolute bottom-4 left-[13px] top-1 w-px bg-border" />
                                {items.map((a, i) => (
                                    <Link
                                        key={a.id}
                                        to={ROUTES.ADMIN_ASSIGNMENT_DETAILS(a.id)}
                                        style={{ animationDelay: `${i * 30}ms` }}
                                        className={cn(
                                            "group relative flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-left-1 fill-mode-both hover:-translate-y-px hover:shadow-[var(--shadow-md)]",
                                            toneClasses.border
                                        )}
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
                );
            })}
        </div>
    );
}