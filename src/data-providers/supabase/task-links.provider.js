import { supabase } from "@/lib/supabase";

/**
 * Supabase data-provider for task_links. Mirrors the shape of your
 * other simple (non-paginated) providers like resources — list/add/remove.
 */
export const taskLinksProvider = {
    async listByTask(taskId) {
        const { data, error } = await supabase
            .from("task_links")
            .select("*")
            .eq("task_id", taskId)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data;
    },

    async add(taskId, { url, label }) {
        const { data, error } = await supabase
            .from("task_links")
            .insert({ task_id: taskId, url, label })
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async remove(id) {
        const { error } = await supabase.from("task_links").delete().eq("id", id);
        if (error) throw error;
    },
};