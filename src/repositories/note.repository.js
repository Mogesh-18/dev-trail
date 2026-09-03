import { notesProvider } from "@/data-providers/supabase/notes.provider";

/**
 * Repository wrapper for note operations.
 * Delegates all calls to `notesProvider`.
 * 
 * @type {{
 *   listByContext: (contextType: string, contextId: string|number) => Promise<Array>,
 *   listByContextPage: (params: { contextType: string, contextId: string|number, cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string | null }>,
 *   listAllPage: (params: { cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string | null }>,
 *   create: (input: { contextType: string, contextId: string|number, body: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const NoteRepository = {
    listByContext: (contextType, contextId) => notesProvider.listByContext(contextType, contextId),
    listByContextPage: (params) => notesProvider.listByContextPage(params),
    listAllPage: (params) => notesProvider.listAllPage(params),
    create: (input) => notesProvider.create(input),
    remove: (id) => notesProvider.remove(id),
};