import { supabase } from "@/lib/supabase";

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
    async list(limit = 50) {
        const { data, error } = await supabase
            .from("activity")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);
        if (error) throw error;
        return data.map(mapActivityRow);
    },

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
        return { items, nextCursor };
    },
};