import { supabase } from "@/lib/supabase";

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

    async create({ contextType, contextId, body }) {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("notes")
            .insert({ author_id: userData.user.id, context_type: contextType, context_id: contextId, body })
            .select()
            .single();
        if (error) throw error;
        return mapNoteRow(data);
    },

    async remove(id) {
        const { error } = await supabase.from("notes").delete().eq("id", id);
        if (error) throw error;
    },

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
        return { items, nextCursor };
    },

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
        return { items, nextCursor };
    },
};