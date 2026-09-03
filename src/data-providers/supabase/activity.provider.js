import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase activity row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.actor_id
 * @param {string} row.type
 * @param {string} row.entity_type
 * @param {string} row.entity_id
 * @param {Object} row.metadata
 * @param {string} row.created_at
 * @returns {Object} Mapped activity entry.
 */
function mapActivityRow(row) {
    return {
        id: row.id,
        actorId: row.actor_id,
        type: row.type,
        entityType: row.entity_type,
        entityId: row.entity_id,
        metadata: row.metadata ?? {},
        createdAt: row.created_at,
    };
}

export const activityProvider = {

    /**
     * Fetches the most recent activity entries.
     * 
     * @param {number} [limit=50] - Maximum number of entries.
     * @returns {Promise<Array>} List of activities, newest first.
     */
    async list(limit = 50) {
        const { data, error } = await supabase
            .from("activity")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data.map(mapActivityRow);
    },

    /**
     * Logs a new activity event.
     * 
     * @param {Object} params
     * @param {string} params.type - Event type (from `EVENTS`).
     * @param {string} params.entityType - e.g., "task", "assignment".
     * @param {string|number} params.entityId - ID of the entity.
     * @param {Object} [params.metadata] - Additional data.
     * @returns {Promise<void>}
     */
    async log({ type, entityType, entityId, metadata }) {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase.from("activity").insert({
            actor_id: userData.user.id,
            type,
            entity_type: entityType,
            entity_id: entityId,
            metadata: metadata ?? {},
        });
        if (error) throw error;
    },

    /**
     * Paginated list of activities, newest first.
     * 
     * @param {Object} params
     * @param {string} [params.cursor] - `created_at` timestamp for pagination.
     * @param {number} [params.pageSize=10]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    async listPage({ cursor, pageSize = 10 }) {
        let query = supabase
            .from("activity")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapActivityRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { 
            items, 
            nextCursor 
        };
    },
};