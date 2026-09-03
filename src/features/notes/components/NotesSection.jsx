import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoadMoreButton } from "@/components/common/LoadMoreButton";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useNotes, useAddNote, useDeleteNote } from "@/features/notes/hooks/useNotes";
import { formatRelativeTime } from "@/utils/format-date";

/**
 * Renders a note-taking section for a given context (task or assignment).
 * Shows existing notes, allows adding and deleting (author only), and supports pagination.
 * 
 * @param {Object} props
 * @param {string} props.contextType - e.g., "task" or "assignment".
 * @param {string|number} props.contextId - ID of the entity.
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
        addNote.mutate(body.trim(), { 
            onSuccess: () => setBody("") 
        });
    }

    return (
        <div className="space-y-3">
            {isLoading && <p className="text-sm text-muted-foreground">Loading notes…</p>}

            {!isLoading && notes.length === 0 && <p className="text-sm text-muted-foreground">No notes yet.</p>}

            {notes.length > 0 && (
                <ul className="space-y-2">
                    {notes.map((note) => (
                        <li key={note.id} className="flex items-start justify-between gap-2 rounded-md border p-2.5 text-sm">
                            <div>
                                <p className="whitespace-pre-wrap">{note.body}</p>
                                <p className="mt-1 text-xs text-muted-foreground">{formatRelativeTime(note.createdAt)}</p>
                            </div>
                            {note.authorId === user?.id && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => deleteNote.mutate(note.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            )}
                        </li>
                    ))}
                </ul>
            )}

            <LoadMoreButton onClick={fetchNextPage} isLoading={isFetchingNextPage} hasMore={!!hasNextPage} />

            <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                    rows={2}
                    placeholder="Add a note…"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="flex-1"
                />
                <Button type="submit" disabled={addNote.isPending} className="self-end">
                    Add
                </Button>
            </form>
        </div>
    );
}