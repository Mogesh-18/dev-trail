import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { useAssignmentsPaginated } from "@/features/assignments/hooks/useAssignments";
import { ROUTES } from "@/constants/routes";

/**
 * Student assignments list — hover-lift rows, staggered entrance,
 * matching AdminAssignmentsPage's row language exactly (one visual
 * system across both roles, not two separate designs).
 *
 * @returns {JSX.Element}
 */
export default function StudentAssignmentsPage() {
    const { items: assignments, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAssignmentsPaginated(10);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Your assignments</h1>
                <p className="text-muted-foreground">Work assigned alongside your tasks.</p>
            </div>

            {assignments.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No assignments yet" description="Check back once one is assigned." />
            ) : (
                <div className="space-y-2">
                    {assignments.map((a, i) => (
                        <Link
                            key={a.id}
                            to={ROUTES.STUDENT_ASSIGNMENT_DETAILS(a.id)}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium transition-colors duration-fast group-hover:text-primary">{a.title}</p>
                                {a.deadline && <p className="text-sm text-muted-foreground">Due {a.deadline}</p>}
                            </div>
                            <StatusBadge status={a.status} />
                        </Link>
                    ))}
                    <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
                </div>
            )}
        </div>
    );
}