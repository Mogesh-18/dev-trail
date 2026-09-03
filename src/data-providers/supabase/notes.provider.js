import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase note row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.author_id
 * @param {string} row.context_type
 * @param {string} row.context_id
 * @param {string} row.body
 * @param {string} row.created_at
 * @returns {Object} Mapped note.
 */
function mapNoteRow(row) {
    return {
        id: row.id,
        authorId: row.author_id,
        contextType: row.context_type,
        contextId: row.context_id,
        body: row.body,
        createdAt: row.created_at,
    };
}

export const notesProvider = {

    /**
     * Fetches all notes for a given context (e.g., task, assignment).
     * 
     * @param {string} contextType - Type of context (e.g., "task", "assignment").
     * @param {string|number} contextId - ID of the context entity.
     * @returns {Promise<Array>} List of notes, oldest first.
     */
    async listByContext(contextType, contextId) {
        const { data, error } = await supabase
            .from("notes")
            .select("*")
            .eq("context_type", contextType)
            .eq("context_id", contextId)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data.map(mapNoteRow);
    },

    /**
     * Creates a new note for a context.
     * 
     * @param {Object} params
     * @param {string} params.contextType
     * @param {string|number} params.contextId
     * @param {string} params.body - Note content.
     * @returns {Promise<Object>} Created note.
     */
    async create({ contextType, contextId, body }) {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase.from("notes")
            .insert({ 
                author_id: userData.user.id, 
                context_type: contextType, 
                context_id: contextId, 
                body 
            })
            .select()
            .single();
        if (error) throw error;
        return mapNoteRow(data);
    },

    /**
     * Deletes a note by ID.
     * 
     * @param {string|number} id - Note ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) throw error;
    },

    /**
     * Paginated list of notes for a context, newest first.
     * 
     * @param {Object} params
     * @param {string} params.contextType
     * @param {string|number} params.contextId
     * @param {string} [params.cursor] - `created_at` timestamp for pagination.
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    async listByContextPage({ contextType, contextId, cursor, pageSize = 10 }) {
        let query = supabase
            .from("notes")
            .select("*")
            .eq("context_type", contextType)
            .eq("context_id", contextId)
            .order("created_at", { ascending: false })
            .limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapNoteRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { 
            items, 
            nextCursor 
        };
    },

    /**
     * Paginated list of all notes (global feed), newest first.
     * 
     * @param {Object} params
     * @param {string} [params.cursor] - `created_at` timestamp for pagination.
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    async listAllPage({ cursor, pageSize = 10 }) {
        let query = supabase
            .from("notes")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapNoteRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { 
            items, 
            nextCursor 
        };
    },
};