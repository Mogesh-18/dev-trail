import { useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ResourceList } from "@/features/assignments/components/ResourceList";
import { NotesSection } from "@/features/notes/components/NotesSection";
import { useAssignment, useAssignmentResources, useUpdateAssignmentStatus } from "@/features/assignments/hooks/useAssignments";
import { ASSIGNMENT_STATUS } from "@/constants/statuses";

/**
 * Student view for a single assignment, allowing status updates (start, submit, resubmit) and viewing resources/notes.
 * 
 * @returns {JSX.Element}
 */
export default function StudentAssignmentDetailsPage() {
    const { assignmentId } = useParams({ strict: false });
    const { data: assignment, isLoading } = useAssignment(assignmentId);
    const { data: resources = [] } = useAssignmentResources(assignmentId);
    const updateStatus = useUpdateAssignmentStatus();

    if (isLoading) {
        return (
            <div className="space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-24 w-full" />
            </div>
        );
    }

    if (!assignment) return <p className="text-muted-foreground">Assignment not found.</p>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{assignment.title}</h1>
                <StatusBadge status={assignment.status} />
            </div>
            {assignment.deadline && <p className="text-sm text-muted-foreground">Due {assignment.deadline}</p>}

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

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Resources</h2>
                <ResourceList assignmentId={assignment.id} resources={resources} canManage={false} />
            </section>

            <div className="flex gap-2">
                {assignment.status === ASSIGNMENT_STATUS.NOT_STARTED && (
                    <Button
                        onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.IN_PROGRESS })}
                        disabled={updateStatus.isPending}
                    >
                        Start assignment
                    </Button>
                )}
                {assignment.status === ASSIGNMENT_STATUS.IN_PROGRESS && (
                    <Button
                        onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.SUBMITTED })}
                        disabled={updateStatus.isPending}
                    >
                        Submit assignment
                    </Button>
                )}
                {assignment.status === ASSIGNMENT_STATUS.CHANGES_REQUESTED && (
                    <Button
                        onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.SUBMITTED })}
                        disabled={updateStatus.isPending}
                    >
                        Resubmit
                    </Button>
                )}
                {(assignment.status === ASSIGNMENT_STATUS.SUBMITTED || assignment.status === ASSIGNMENT_STATUS.UNDER_REVIEW) && (
                    <p className="text-sm text-muted-foreground">Waiting for review.</p>
                )}
            </div>

            <section className="space-y-3 rounded-lg border p-4">
                <h2 className="font-medium">Notes</h2>
                <NotesSection contextType="assignment" contextId={assignment.id} />
            </section>
        </div>
    );
}