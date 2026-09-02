import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { StickyNote } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { useAllNotesPaginated } from "@/features/notes/hooks/useNotes";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { useAssignments } from "@/features/assignments/hooks/useAssignments";
import { ROUTES } from "@/constants/routes";
import { formatRelativeTime } from "@/utils/format-date";

const CONTEXT_LABEL = {
    task: "Task",
    assignment: "Assignment",
    progress: "Progress",
    admin_feedback: "Feedback",
};

export default function AdminNotesPage() {
    const { items: notes, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAllNotesPaginated(15);
    const { data: tasks = [] } = useTasks();
    const { data: assignments = [] } = useAssignments();

    const tasksById = useMemo(() => Object.fromEntries(tasks.map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries(assignments.map((a) => [a.id, a])), [assignments]);

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-2xl font-semibold">Notes</h1>
                <p className="text-muted-foreground">Every note left on a task or assignment, newest first.</p>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
            )}

            {!isLoading && notes.length === 0 && (
                <EmptyState icon={StickyNote} title="No notes yet" description="Notes added on tasks or assignments will show up here." />
            )}

            {!isLoading && notes.length > 0 && (
                <div className="space-y-2">
                    {notes.map((note) => {
                        const entity = note.contextType === "task" ? tasksById[note.contextId] : assignmentsById[note.contextId];
                        const href =
                            note.contextType === "task"
                                ? ROUTES.ADMIN_TASK_DETAILS(note.contextId)
                                : note.contextType === "assignment"
                                    ? ROUTES.ADMIN_ASSIGNMENT_DETAILS(note.contextId)
                                    : null;

                        return (
                            <div key={note.id} className="rounded-lg border bg-card p-3">
                                <div className="flex items-center justify-between gap-2">
                                    {href ? (
                                        <Link to={href} className="text-sm font-medium hover:underline">
                                            {entity?.title ?? CONTEXT_LABEL[note.contextType]}
                                        </Link>
                                    ) : (
                                        <span className="text-sm font-medium">{CONTEXT_LABEL[note.contextType]}</span>
                                    )}
                                    <span className="shrink-0 text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</span>
                                </div>
                                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{note.body}</p>
                            </div>
                        );
                    })}
                </div>
            )}

            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />
        </div>
    );
}