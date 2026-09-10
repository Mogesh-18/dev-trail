import { useState } from "react";
import { Plus, ClipboardList } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { StatusBadge } from "@/components/common/StatusBadge";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { AssignmentFormDialog } from "@/features/assignments/components/AssignmentFormDialog";
import {
    useAssignmentsPaginated, useAssignmentTaskLinks, useCreateAssignment, useDeleteAssignment,
} from "@/features/assignments/hooks/useAssignments";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { ROUTES } from "@/constants/routes";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";

/**
 * Admin assignments list. Rows now lift and gain shadow on hover
 * (the row itself is the click target's visual anchor even though the
 * title is the link), and entrances stagger in on load.
 *
 * @returns {JSX.Element}
 */
export default function AdminAssignmentsPage() {
    const { items: assignments, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAssignmentsPaginated(10);
    const { data: taskLinks = [] } = useAssignmentTaskLinks();
    const { data: allTasks = [] } = useTasks();
    const createAssignment = useCreateAssignment();
    const deleteAssignment = useDeleteAssignment();

    const [formOpen, setFormOpen] = useState(false);
    const [deletingAssignment, setDeletingAssignment] = useState(null);

    function handleSubmit(values) {
        createAssignment.mutateAsync(values).then(() => setFormOpen(false));
    }

    function handleConfirmDelete() {
        if (!deletingAssignment) return;
        deleteAssignment.mutate(deletingAssignment.id, { onSuccess: () => setDeletingAssignment(null) });
    }

    useKeyboardShortcut({ key: "n" }, () => setFormOpen(true));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between duration-slow animate-in fade-in slide-in-from-bottom-1">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Assignments</h1>
                    <p className="text-muted-foreground">Work assigned alongside the learning path.</p>
                </div>
                <Button onClick={() => setFormOpen(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    New assignment
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            )}

            {!isLoading && assignments.length === 0 && (
                <EmptyState
                    icon={ClipboardList}
                    title="No assignments yet"
                    description="Create an assignment and optionally link it to one or more tasks."
                    actionLabel="Create assignment"
                    onAction={() => setFormOpen(true)}
                />
            )}

            {!isLoading && assignments.length > 0 && (
                <div className="space-y-2">
                    {assignments.map((assignment, i) => (
                        <div
                            key={assignment.id}
                            style={{ animationDelay: `${i * 40}ms` }}
                            className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:-translate-y-px hover:border-primary/30 hover:shadow-[var(--shadow-md)]"
                        >
                            <Link to={ROUTES.ADMIN_ASSIGNMENT_DETAILS(assignment.id)} className="min-w-0 flex-1">
                                <p className="truncate font-medium transition-colors duration-fast group-hover:text-primary">{assignment.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {taskLinks.filter((l) => l.assignmentId === assignment.id).length} linked task(s)
                                    {assignment.deadline ? ` · due ${assignment.deadline}` : ""}
                                </p>
                            </Link>
                            <StatusBadge status={assignment.status} />
                            <Button variant="ghost" size="sm" className="hover:text-destructive" onClick={() => setDeletingAssignment(assignment)}>
                                Delete
                            </Button>
                        </div>
                    ))}
                    <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
                </div>
            )}

            <AssignmentFormDialog
                open={formOpen}
                onOpenChange={setFormOpen}
                assignment={null}
                allTasks={allTasks}
                taskLinks={taskLinks}
                onSubmit={handleSubmit}
                isPending={createAssignment.isPending}
            />

            <ConfirmDeleteDialog
                open={!!deletingAssignment}
                onOpenChange={(open) => !open && setDeletingAssignment(null)}
                title="Delete this assignment?"
                description={`"${deletingAssignment?.title}" and its resources will be permanently removed.`}
                onConfirm={handleConfirmDelete}
                isPending={deleteAssignment.isPending}
            />
        </div>
    );
}