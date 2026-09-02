import { supabase } from "@/lib/supabase";

function mapProfileRow(row) {
    return {
        id: row.id,
        email: row.email,
        role: row.role,
        displayName: row.display_name,
        avatarUrl: row.avatar_url,
        lastLoginAt: row.last_login_at,
        createdAt: row.created_at,
    };
}

export const profilesProvider = {
    async list() {
        const { data, error } = await supabase.from("profiles").select("*").order("role", { ascending: true });
        if (error) throw error;
        return data.map(mapProfileRow);
    },

    async getById(id) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
        if (error) throw error;
        return mapProfileRow(data);
    },

    async updateSelf({ displayName, avatarUrl }) {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("profiles")
            .update({ display_name: displayName, avatar_url: avatarUrl })
            .eq("id", userData.user.id)
            .select()
            .single();
        if (error) throw error;
        return mapProfileRow(data);
    },

    async uploadAvatar(file) {
        const { data: userData } = await supabase.auth.getUser();
        const path = `${userData.user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        return data.publicUrl;
    },
};