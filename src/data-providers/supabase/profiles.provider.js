import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase profile row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.email
 * @param {string} row.role
 * @param {string} row.display_name
 * @param {string} row.avatar_url
 * @param {string} row.last_login_at
 * @param {string} row.created_at
 * @returns {Object} Mapped profile.
 */
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

    /**
     * Fetches all user profiles, ordered by role.
     * 
     * @returns {Promise<Array>} List of profiles.
     */
    async list() {
        const { data, error } = await supabase.from("profiles").select("*").order("role", { ascending: true });
        if (error) throw error;
        return data.map(mapProfileRow);
    },

    /**
     * Fetches a profile by user ID.
     * 
     * @param {string} id - User ID.
     * @returns {Promise<Object>} Profile.
     */
    async getById(id) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", id).single();
        if (error) throw error;
        return mapProfileRow(data);
    },

    /**
     * Updates the current user's profile (display name and avatar URL).
     * 
     * @param {Object} params
     * @param {string} params.displayName
     * @param {string} params.avatarUrl
     * @returns {Promise<Object>} Updated profile.
     */
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

    /**
     * Uploads a new avatar image for the current user.
     * 
     * @param {File} file - Image file.
     * @returns {Promise<string>} Public URL of the uploaded avatar.
     */
    async uploadAvatar(file) {
        const { data: userData } = await supabase.auth.getUser();
        const path = `${userData.user.id}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        return data.publicUrl;
    },
};