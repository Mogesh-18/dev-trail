import { useParams } from "@tanstack/react-router";
import { Lock, CalendarDays, Hourglass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/common/StatusBadge";
import { RichTextView } from "@/components/common/RichTextView";
import { ResourceList } from "@/features/assignments/components/ResourceList";
import { NotesSection } from "@/features/notes/components/NotesSection";
import { SubmissionsSection } from "@/features/assignments/components/SubmissionsSection";
import { useAssignment, useAssignmentResources, useAssignmentTaskLinks, useUpdateAssignmentStatus } from "@/features/assignments/hooks/useAssignments";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useProgress } from "@/features/progress/hooks/useProgress";
import { getIncompleteLinkedTaskTitles } from "@/features/assignments/utils/can-start-assignment";
import { ASSIGNMENT_STATUS } from "@/constants/statuses";

/**
 * Student assignment detail — same two-column structure as the admin
 * page: rich content + resources/submissions/notes on the left, a
 * sticky overview sidebar (deadline, estimate, linked-task lock
 * status) on the right.
 *
 * @returns {JSX.Element}
 */
export default function StudentAssignmentDetailsPage() {
    const { assignmentId } = useParams({ strict: false });
    const { data: assignment, isLoading } = useAssignment(assignmentId);
    const { data: resources = [] } = useAssignmentResources(assignmentId);
    const { data: taskLinks = [] } = useAssignmentTaskLinks();
    const { data: tasks = [] } = useTasks();
    const { data: progress = [] } = useProgress();
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

    const progressByTaskId = Object.fromEntries(progress.map((p) => [p.taskId, p]));
    const incompleteTitles = getIncompleteLinkedTaskTitles(assignment.id, taskLinks, tasks, progressByTaskId);
    const isLocked = assignment.status === ASSIGNMENT_STATUS.NOT_STARTED && incompleteTitles.length > 0;

    const sections = [
        assignment.instructions && { title: "Instructions", body: assignment.instructions },
        assignment.requirements && { title: "Requirements", body: assignment.requirements },
        assignment.acceptanceCriteria && { title: "Acceptance criteria", body: assignment.acceptanceCriteria },
    ].filter(Boolean);

    return (
        <div className="grid grid-cols-1 items-start gap-6 duration-slow animate-in fade-in slide-in-from-bottom-1 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0 space-y-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">{assignment.title}</h1>
                        <StatusBadge status={assignment.status} />
                    </div>
                    {assignment.deadline && <p className="text-sm text-muted-foreground">Due {assignment.deadline}</p>}
                </div>

                {isLocked && (
                    <div className="flex items-center gap-3 rounded-lg border border-status-locked/30 bg-status-locked/10 p-3 text-sm shadow-[var(--shadow-sm)]">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-status-locked/20 text-status-locked">
                            <Lock className="h-4 w-4" />
                        </span>
                        <span className="text-muted-foreground">Complete {incompleteTitles.join(", ")} first to unlock this assignment.</span>
                    </div>
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
                        No details added for this assignment yet.
                    </div>
                )}

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h2 className="font-medium">Resources</h2>
                    <ResourceList assignmentId={assignment.id} resources={resources} canManage={false} />
                </section>

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h2 className="font-medium">Your submissions</h2>
                    <SubmissionsSection assignmentId={assignment.id} mode="student" />
                </section>

                <div className="flex gap-2">
                    {assignment.status === ASSIGNMENT_STATUS.NOT_STARTED && (
                        <Button
                            onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.IN_PROGRESS })}
                            disabled={updateStatus.isPending || isLocked}
                            title={isLocked ? `Complete ${incompleteTitles.join(", ")} first` : undefined}
                        >
                            {updateStatus.isPending ? "Starting…" : "Start assignment"}
                        </Button>
                    )}
                    {assignment.status === ASSIGNMENT_STATUS.IN_PROGRESS && (
                        <Button onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.SUBMITTED })} disabled={updateStatus.isPending}>
                            {updateStatus.isPending ? "Saving…" : "Submit assignment"}
                        </Button>
                    )}
                    {assignment.status === ASSIGNMENT_STATUS.CHANGES_REQUESTED && (
                        <Button onClick={() => updateStatus.mutate({ id: assignment.id, status: ASSIGNMENT_STATUS.SUBMITTED })} disabled={updateStatus.isPending}>
                            Resubmit
                        </Button>
                    )}
                    {(assignment.status === ASSIGNMENT_STATUS.SUBMITTED || assignment.status === ASSIGNMENT_STATUS.UNDER_REVIEW) && (
                        <p className="text-sm text-muted-foreground">Waiting for review.</p>
                    )}
                </div>

                <section className="space-y-3 rounded-lg border border-border/60 bg-card p-4 shadow-[var(--shadow-sm)]">
                    <h2 className="font-medium">Notes</h2>
                    <NotesSection contextType="assignment" contextId={assignment.id} />
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
                    </dl>
                </div>

                {incompleteTitles.length > 0 && (
                    <div className="rounded-lg border border-status-locked/30 bg-status-locked/5 p-4">
                        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-status-locked">Waiting on</h3>
                        <ul className="space-y-1.5">
                            {incompleteTitles.map((title) => (
                                <li key={title} className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Lock className="h-3 w-3 shrink-0" />
                                    <span className="truncate">{title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </aside>
        </div>
    );
}