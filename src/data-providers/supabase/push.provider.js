import { supabase } from "@/lib/supabase";

export const pushProvider = {

    /**
     * Fetches the current device's subscription (if any).
     * 
     * @param {string} endpoint - The push endpoint URL.
     * @returns {Promise<Object|null>} The subscription row or null.
     */
    async getSubscriptionForCurrentDevice(endpoint) {
        const { data, error } = await supabase.from("push_subscriptions").select("id").eq("endpoint", endpoint).maybeSingle();
        if (error) throw error;
        return data;
    },

    /**
     * Saves or upserts a push subscription for the current user.
     * 
     * @param {Object} params
     * @param {string} params.endpoint
     * @param {string} params.p256dh - P256DH key.
     * @param {string} params.authKey - Auth key.
     * @returns {Promise<void>}
     */
    async save({ endpoint, p256dh, authKey }) {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("push_subscriptions")
            .upsert(
                { 
                    user_id: userData.user.id, 
                    endpoint, 
                    p256dh, 
                    auth_key: authKey 
                },
                { 
                    onConflict: "endpoint" 
                }
            );
        if (error) throw error;
    },

    /**
     * Removes a push subscription by endpoint.
     * 
     * @param {string} endpoint - The push endpoint URL.
     * @returns {Promise<void>}
     */
    async remove(endpoint) {
        const { error } = await supabase.from("push_subscriptions").delete().eq("endpoint", endpoint);
        if (error) throw error;
    },
};