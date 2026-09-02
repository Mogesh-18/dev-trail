import { Link } from "@tanstack/react-router";
import { ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { useAssignmentsPaginated } from "@/features/assignments/hooks/useAssignments";
import { ROUTES } from "@/constants/routes";

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
            <div>
                <h1 className="text-2xl font-semibold">Your assignments</h1>
                <p className="text-muted-foreground">Work assigned alongside your tasks.</p>
            </div>

            {assignments.length === 0 ? (
                <EmptyState icon={ClipboardList} title="No assignments yet" description="Check back once one is assigned." />
            ) : (
                <div className="space-y-2">
                    {assignments.map((a) => (
                        <Link
                            key={a.id}
                            to={ROUTES.STUDENT_ASSIGNMENT_DETAILS(a.id)}
                            className="flex items-center gap-3 rounded-lg border bg-card p-3 hover:bg-accent/40"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{a.title}</p>
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