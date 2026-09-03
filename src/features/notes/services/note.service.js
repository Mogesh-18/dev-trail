import { NoteRepository } from "@/repositories/note.repository";

/**
 * Service layer for note operations, delegating to `NoteRepository`.
 * 
 * @type {{
 *   listByContext: (contextType: string, contextId: string|number) => Promise<Array>,
 *   listByContextPage: (params: { contextType: string, contextId: string|number, cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string|null }>,
 *   listAllPage: (params: { cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string|null }>,
 *   create: (input: { contextType: string, contextId: string|number, body: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const NoteService = {

    /**
     * Fetches all notes for a given context.
     * 
     * @param {string} contextType - Type of context (e.g., "task", "assignment").
     * @param {string|number} contextId - ID of the entity.
     * @returns {Promise<Array>} List of notes (oldest first).
     */
    listByContext: (contextType, contextId) => NoteRepository.listByContext(contextType, contextId),

    /**
     * Paginated list of notes for a context (newest first).
     * 
     * @param {Object} params - Pagination options.
     * @param {string} params.contextType
     * @param {string|number} params.contextId
     * @param {string} [params.cursor] - `created_at` cursor.
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    listByContextPage: (params) => NoteRepository.listByContextPage(params),

    /**
     * Paginated list of all notes across contexts (global feed, newest first).
     * 
     * @param {Object} params
     * @param {string} [params.cursor]
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    listAllPage: (params) => NoteRepository.listAllPage(params),

    /**
     * Creates a new note.
     * 
     * @param {Object} input
     * @param {string} input.contextType
     * @param {string|number} input.contextId
     * @param {string} input.body
     * @returns {Promise<Object>} Created note.
     */
    create: (input) => NoteRepository.create(input),

    /**
     * Deletes a note by ID.
     * 
     * @param {string|number} id - Note ID.
     * @returns {Promise<void>}
     */
    remove: (id) => NoteRepository.remove(id),
};