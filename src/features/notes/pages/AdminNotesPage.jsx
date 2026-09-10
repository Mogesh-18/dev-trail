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

const CONTEXT_LABEL = { task: "Task", assignment: "Assignment", progress: "Progress", admin_feedback: "Feedback" };

/**
 * Every note across the app, newest first — rows lift on hover and
 * stagger in on load, matching every other list page.
 *
 * @returns {JSX.Element}
 */
export default function AdminNotesPage() {
    const { items: notes, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useAllNotesPaginated(15);
    const { data: tasks = [] } = useTasks();
    const { data: assignments = [] } = useAssignments();

    const tasksById = useMemo(() => Object.fromEntries(tasks.map((t) => [t.id, t])), [tasks]);
    const assignmentsById = useMemo(() => Object.fromEntries(assignments.map((a) => [a.id, a])), [assignments]);

    return (
        <div className="space-y-4">
            <div className="duration-slow animate-in fade-in slide-in-from-bottom-1">
                <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
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
                    {notes.map((note, i) => {
                        const entity = note.contextType === "task" ? tasksById[note.contextId] : assignmentsById[note.contextId];
                        const href =
                            note.contextType === "task"
                                ? ROUTES.ADMIN_TASK_DETAILS(note.contextId)
                                : note.contextType === "assignment"
                                    ? ROUTES.ADMIN_ASSIGNMENT_DETAILS(note.contextId)
                                    : null;

                        return (
                            <div
                                key={note.id}
                                style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                                className="rounded-lg border border-border/60 bg-card p-3 shadow-[var(--shadow-sm)] transition-all duration-base ease-trail duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both hover:shadow-[var(--shadow-md)]"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    {href ? (
                                        <Link to={href} className="text-sm font-medium text-primary hover:underline">
                                            {entity?.title ?? CONTEXT_LABEL[note.contextType]}
                                        </Link>
                                    ) : (
                                        <span className="text-sm font-medium">{CONTEXT_LABEL[note.contextType]}</span>
                                    )}
                                    <span className="shrink-0 font-mono text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</span>
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