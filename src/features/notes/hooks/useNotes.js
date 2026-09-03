import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { NoteService } from "@/features/notes/services/note.service";

/**
 * Paginated notes for a specific context (task/assignment).
 * 
 * @param {string} contextType - Context type.
 * @param {string|number} contextId - Context ID.
 * @param {number} [pageSize=5] - Items per page.
 * @returns {Object} Result from `useCursorPagination` plus `items`.
 */
export function useNotes(contextType, contextId, pageSize = 5) {
    return useCursorPagination({
        queryKey: ["notes", contextType, contextId],
        fetchPage: (cursor) => NoteService.listByContextPage({ contextType, contextId, cursor, pageSize }),
        enabled: !!contextId,
    });
}

/**
 * Paginated notes across all contexts (global feed).
 * 
 * @param {number} [pageSize=10] - Items per page.
 * @returns {Object} Result from `useCursorPagination` plus `items`.
 */
export function useAllNotesPaginated(pageSize = 10) {
    return useCursorPagination({
        queryKey: ["notes", "all"],
        fetchPage: (cursor) => NoteService.listAllPage({ cursor, pageSize }),
    });
}

/**
 * Mutation for adding a note to a specific context.
 * 
 * @param {string} contextType - Context type.
 * @param {string|number} contextId - Context ID.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
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

/**
 * Mutation for deleting a note from a specific context.
 * 
 * @param {string} contextType - Context type.
 * @param {string|number} contextId - Context ID.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
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