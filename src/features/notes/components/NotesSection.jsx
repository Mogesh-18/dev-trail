import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { TrailLoader } from "@/components/common/TrailLoader";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotes, useAddNote, useDeleteNote } from "@/features/notes/hooks/useNotes";
import { formatRelativeTime } from "@/utils/format-date";

/**
 * Note thread for a task or assignment. Own notes get a subtle
 * left-accent bar so authorship is visible at a glance without
 * re-reading who wrote what.
 *
 * @param {Object} props
 * @param {string} props.contextType
 * @param {string|number} props.contextId
 * @returns {JSX.Element}
 */
export function NotesSection({ contextType, contextId }) {
    const { user } = useAuth();
    const { items: notes, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useNotes(contextType, contextId);
    const addNote = useAddNote(contextType, contextId);
    const deleteNote = useDeleteNote(contextType, contextId);
    const [body, setBody] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        if (!body.trim()) return;
        addNote.mutate(body.trim(), { onSuccess: () => setBody("") });
    }

    return (
        <div className="space-y-3">
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrailLoader size="sm" />
                    Loading notes…
                </div>
            )}

            {!isLoading && notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}

            {notes.length > 0 && (
                <ul className="space-y-2">
                    {notes.map((note, i) => {
                        const isOwn = note.authorId === user?.id;
                        return (
                            <li
                                key={note.id}
                                style={{ animationDelay: `${i * 40}ms` }}
                                className={`flex items-start justify-between gap-2 rounded-md border-l-2 bg-card p-2.5 text-sm shadow-[var(--shadow-sm)] duration-base animate-in fade-in slide-in-from-bottom-1 fill-mode-both ${isOwn ? "border-l-primary" : "border-l-border"}`}
                            >
                                <div>
                                    <p className="whitespace-pre-wrap">{note.body}</p>
                                    <p className="mt-1 font-mono text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</p>
                                </div>
                                {isOwn && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                                        onClick={() => deleteNote.mutate(note.id)}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}

            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea rows={2} placeholder="Add a note…" value={body} onChange={(e) => setBody(e.target.value)} className="flex-1" />
                <Button type="submit" disabled={addNote.isPending} className="self-end">
                    Add
                </Button>
            </form>
        </div>
    );
}