import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Pencil, Trash2, Clock, CalendarDays, ListChecks, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RichTextView } from "@/components/common/RichTextView";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { AssignmentFormDialog } from "@/features/assignments/components/AssignmentFormDialog";
import { ResourceList } from "@/features/assignments/components/ResourceList";
import { AddResourceForm } from "@/features/assignments/components/AddResourceForm";
import { SubmissionsSection } from "@/features/assignments/components/SubmissionsSection";
import {
    useAssignment, useAssignmentTaskLinks, useAssignmentResources, useUpdateAssignment, useUpdateAssignmentStatus, useDeleteAssignment,
} from "@/features/assignments/hooks/useAssignments";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { ROUTES } from "@/constants/routes";
import { ASSIGNMENT_STATUS } from "@/constants/statuses";

/**
 * Admin assignment detail — two-column layout: main content (rich
 * text sections, resources, submissions) on the left, a persistent
 * meta/status sidebar on the right (deadline, linked tasks with a
 * checklist look, quick stats). Fills the horizontal space that used
 * to sit empty on wide screens and gives the page a real hierarchy
 * instead of one long column of thin sections.
 *
 * @returns {JSX.Element}
 */
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

    if (!assignment) return <p className="text-muted-foreground">Assignment not found.</p>;

    const linkedTasks = allTasks.filter((t) => taskLinks.some((l) => l.assignmentId === assignment.id && l.taskId === t.id));
    const needsReview = assignment.status === ASSIGNMENT_STATUS.SUBMITTED || assignment.status === ASSIGNMENT_STATUS.UNDER_REVIEW;

    function handleUpdate(values) {
        updateAssignment.mutateAsync({ id: assignment.id, input: values }).then(() => setEditOpen(false));
    }

    function handleDelete() {
        deleteAssignment.mutate(assignment.id, { onSuccess: () => navigate({ to: ROUTES.ADMIN_ASSIGNMENTS }) });
    }

    const sections = [
        assignment.instructions && { title: "Instructions", body: assignment.instructions },
        assignment.requirements && { title: "Requirements", body: assignment.requirements },
        assignment.acceptanceCriteria && { title: "Acceptance criteria", body: assignment.acceptanceCriteria },
    ].filter(Boolean);

    return (
        <div className="grid grid-cols-1 items-start gap-6 duration-slow animate-in fade-in slide-in-from-bottom-1 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0 space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
                            <StatusBadge status={assignment.status} />
                        </div>
                        {assignment.deadline && <p className="text-sm text-muted-foreground">Due {assignment.deadline}</p>}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-2" onClick={() => setEditOpen(true)}>
                            <Pencil className="h-4 w-4" />
                            Edit
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 hover:text-destructive" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="h-4 w-4" />
                            Delete
                        </Button>
                    </div>
                </div>

                {needsReview && (
                    <section className="flex items-center gap-3 rounded-lg border border-status-progress/30 bg-status-progress/10 p-4 shadow-[var(--shadow-sm)]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-status-progress/20 text-status-progress">
                            <Clock className="h-4 w-4" />
                        </span>
                        <span className="mr-auto text-sm font-medium">Waiting on your review.</span>
                        <Button variant="outline" onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.CHANGES_REQUESTED })} disabled={updateStatus.isPending}>
                            Request changes
                        </Button>
                        <Button onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.COMPLETED })} disabled={updateStatus.isPending}>
                            Mark complete
                        </Button>
                    </section>
                )}

                {sections.length > 0 ? (
                    <div className="rounded-lg border border-border/60 bg-card p-5 shadow-[var(--shadow-sm)]">
                        {sections.map((s, i) => (
                            <div key={s.title} className={i > 0 ? "mt-4 border-t border-border/60 pt-4" : ""}>
                                <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{s.title}</h2>
                                <RichTextView html={s.body} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-lg border border-dashed border-border p-5 text-center text-sm text-muted-foreground">
                        No instructions, requirements, or acceptance criteria added yet.
                    </div>
                )}

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h2 className="font-medium">Resources</h2>
                    <ResourceList assignmentId={assignment.id} resources={resources} />
                    <AddResourceForm assignmentId={assignment.id} />
                </section>

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h2 className="font-medium">Submissions</h2>
                    <SubmissionsSection assignmentId={assignment.id} mode="admin" />
                </section>
            </div>

            <aside className="space-y-3 lg:sticky lg:top-6">
                <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overview</h3>
                    <dl className="space-y-3 text-sm">
                        <div className="flex items-center gap-2.5">
                            <CalendarDays className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <dt className="text-xs text-muted-foreground">Deadline</dt>
                                <dd className="font-medium">{assignment.deadline || "No deadline set"}</dd>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Hourglass className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <dt className="text-xs text-muted-foreground">Estimated time</dt>
                                <dd className="font-medium">{assignment.estimatedMinutes ? `${assignment.estimatedMinutes} min` : "Not estimated"}</dd>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0">
                                <dt className="text-xs text-muted-foreground">Resources</dt>
                                <dd className="font-medium">{resources.length}</dd>
                            </div>
                        </div>
                    </dl>
                </div>

                {linkedTasks.length > 0 && (
                    <div className="rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Linked tasks</h3>
                        <ul className="space-y-1.5">
                            {linkedTasks.map((t) => (
                                <li key={t.id} className="flex items-center gap-2 text-sm">
                                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                    <span className="truncate">{t.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>

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