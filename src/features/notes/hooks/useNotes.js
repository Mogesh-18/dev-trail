import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { NoteService } from "@/features/notes/services/note.service";

export function useNotes(contextType, contextId, pageSize = 5) {
    return useCursorPagination({
        queryKey: ["notes", contextType, contextId],
        fetchPage: (cursor) => NoteService.listByContextPage({ contextType, contextId, cursor, pageSize }),
        enabled: !!contextId,
    });
}

export function useAllNotesPaginated(pageSize = 10) {
    return useCursorPagination({
        queryKey: ["notes", "all"],
        fetchPage: (cursor) => NoteService.listAllPage({ cursor, pageSize }),
    });
}

export function useAddNote(contextType, contextId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body) => NoteService.create({ contextType, contextId, body }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", contextType, contextId] });
            queryClient.invalidateQueries({ queryKey: ["notes", "all"] });
        },
    });
}

export function useDeleteNote(contextType, contextId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => NoteService.remove(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes", contextType, contextId] });
            queryClient.invalidateQueries({ queryKey: ["notes", "all"] });
        },
    });
}