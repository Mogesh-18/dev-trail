import { useState } from "react";
import { ClipboardList } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { AssignmentQuickViewDialog } from "@/features/assignments/components/AssignmentQuickViewDialog";
import { useAssignmentsPaginated, useAssignmentTaskLinks } from "@/features/assignments/hooks/useAssignments";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { getIncompleteLinkedTaskTitles } from "@/features/assignments/utils/can-start-assignment";

/**
 * Student assignments list. Rows now open AssignmentQuickViewDialog
 * (resources + submissions) instead of navigating straight to the
 * detail page; the dialog's own "Open full page" link still gets you
 * there. Locked reasons are computed here since this page already has
 * tasks/progress/taskLinks loaded.
 *
 * @returns {JSX.Element}
 */
export default function StudentAssignmentsPage() {
    const { items: assignments, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAssignmentsPaginated(10);
    const { data: taskLinks = [] } = useAssignmentTaskLinks();
    const { data: tasks = [] } = useTasks();
    const { data: progress = [] } = useProgress();

    const [viewingAssignment, setViewingAssignment] = useState(null);

    if (isLoading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                ))}
            </div>
        );
    }

    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));
    const viewingLockedReasons = viewingAssignment
        ? getIncompleteLinkedTaskTitles(viewingAssignment.id, taskLinks, tasks, progressByTaskId)
        : [];

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
                        <button
                            type="button"
                            key={a.id}
                            onClick={() => setViewingAssignment(a)}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className="group flex w-full items-center gap-3 rounded-lg border border-border/60 bg-card p-3 text-left shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                        >
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium transition-colors duration-fast group-hover:text-primary">{a.title}</p>
                                {a.deadline && <p className="text-sm text-muted-foreground">Due {a.deadline}</p>}
                            </div>
                            <StatusBadge status={a.status} />
                        </button>
                    ))}
                    <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
                </div>
            )}

            <AssignmentQuickViewDialog
                open={!!viewingAssignment}
                onOpenChange={(open) => !open && setViewingAssignment(null)}
                assignment={viewingAssignment}
                mode="student"
                lockedReasons={viewingLockedReasons}
            />
        </div>
    );
}