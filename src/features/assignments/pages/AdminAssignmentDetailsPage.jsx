import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { AssignmentFormDialog } from "@/features/assignments/components/AssignmentFormDialog";
import { ResourceList } from "@/features/assignments/components/ResourceList";
import { AddResourceForm } from "@/features/assignments/components/AddResourceForm";
import {
    useAssignment,
    useAssignmentTaskLinks,
    useAssignmentResources,
    useUpdateAssignment,
    useUpdateAssignmentStatus,
    useDeleteAssignment,
} from "@/features/assignments/hooks/useAssignments";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { ROUTES } from "@/constants/routes";
import { ASSIGNMENT_STATUS } from "@/constants/statuses";

export default function AdminAssignmentDetailsPage() {
    const { assignmentId } = useParams({ strict: false });
    const navigate = useNavigate();

    const { data: assignment, isLoading } = useAssignment(assignmentId);
    const { data: taskLinks = [] } = useAssignmentTaskLinks();
    const { data: allTasks = [] } = useTasks();
    const { data: resources = [] } = useAssignmentResources(assignmentId);
    const updateAssignment = useUpdateAssignment();
    const updateStatus = useUpdateAssignmentStatus();
    const deleteAssignment = useDeleteAssignment();

    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (!assignment) {
        return <p className="text-muted-foreground">Assignment not found.</p>;
    }

    const linkedTasks = allTasks.filter((t) =>
        taskLinks.some((l) => l.assignmentId === assignment.id && l.taskId === t.id)
    );

    const needsReview =
        assignment.status === ASSIGNMENT_STATUS.SUBMITTED || assignment.status === ASSIGNMENT_STATUS.UNDER_REVIEW;

    function handleUpdate(values) {
        updateAssignment.mutateAsync({ id: assignment.id, input: values }).then(() => setEditOpen(false));
    }

    function handleDelete() {
        deleteAssignment.mutate(assignment.id, {
            onSuccess: () => navigate({ to: ROUTES.ADMIN_ASSIGNMENTS }),
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold">{assignment.title}</h1>
                        <StatusBadge status={assignment.status} />
                    </div>
                    {assignment.deadline && <p className="text-sm text-muted-foreground">Due {assignment.deadline}</p>}
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {needsReview && (
                <section className="flex items-center gap-2 rounded-lg border p-4">
                    <span className="mr-auto text-sm text-muted-foreground">Waiting on your review.</span>
                    <Button
                        variant="outline"
                        onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.CHANGES_REQUESTED })}
                        disabled={updateStatus.isPending}
                    >
                        Request changes
                    </Button>
                    <Button
                        onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.COMPLETED })}
                        disabled={updateStatus.isPending}
                    >
                        Mark complete
                    </Button>
                </section>
            )}

            {assignment.instructions && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Instructions</h2>
                    <p className="whitespace-pre-wrap text-sm">{assignment.instructions}</p>
                </section>
            )}

            {assignment.requirements && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Requirements</h2>
                    <p className="whitespace-pre-wrap text-sm">{assignment.requirements}</p>
                </section>
            )}

            {assignment.acceptanceCriteria && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Acceptance criteria</h2>
                    <p className="whitespace-pre-wrap text-sm">{assignment.acceptanceCriteria}</p>
                </section>
            )}

            {linkedTasks.length > 0 && (
                <section className="space-y-1">
                    <h2 className="text-sm font-medium text-muted-foreground">Linked tasks</h2>
                    <ul className="list-inside list-disc text-sm">
                        {linkedTasks.map((t) => (
                            <li key={t.id}>{t.title}</li>
                        ))}
                    </ul>
                </section>
            )}

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Resources</h2>
                <ResourceList assignmentId={assignment.id} resources={resources} />
                <AddResourceForm assignmentId={assignment.id} />
            </section>

            <AssignmentFormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                assignment={assignment}
                allTasks={allTasks}
                taskLinks={taskLinks}
                onSubmit={handleUpdate}
                isPending={updateAssignment.isPending}
            />

            <ConfirmDeleteDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete this assignment?"
                description={`"${assignment.title}" and its resources will be permanently removed.`}
                onConfirm={handleDelete}
                isPending={deleteAssignment.isPending}
            />
        </div>
    );
}