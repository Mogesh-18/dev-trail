import { supabase } from "@/lib/supabase";

/**
 * Data provider for global search across tasks, assignments, notes, and reports.
 * 
 * @type {{
 *   search: (query: string, limit?: number) => Promise<{
 *     tasks: Array<{ id: string, title: string, snippet: string }>,
 *     assignments: Array<{ id: string, title: string, snippet: string }>,
 *     notes: Array<{ id: string, contextType: string, contextId: string, snippet: string }>,
 *     reports: Array<{ id: string, taskId: string, title: string, snippet: string }>
 *   }>
 * }}
 */
export const searchProvider = {

    /**
     * Performs a full‑text search across tasks, assignments, notes, and reports.
     * 
     * @param {string} query - The search term (will be wrapped in `%` for ILIKE).
     * @param {number} [limit=5] - Max results per entity type.
     * @returns {Promise<{
     *   tasks: Array<{ id: string, title: string, snippet: string }>,
     *   assignments: Array<{ id: string, title: string, snippet: string }>,
     *   notes: Array<{ id: string, contextType: string, contextId: string, snippet: string }>,
     *   reports: Array<{ id: string, taskId: string, title: string, snippet: string }>
     * }>}
     */
    async search(query, limit = 5) {
        const pattern = `%${query}%`;

        const [tasks, assignments, notes, reports] = await Promise.all([
            supabase.from("tasks").select("id,title,description").or(`title.ilike.${pattern},description.ilike.${pattern},instructions.ilike.${pattern}`).limit(limit),
            supabase.from("assignments").select("id,title,instructions").or(`title.ilike.${pattern},instructions.ilike.${pattern}`).limit(limit),
            supabase.from("notes").select("id,context_type,context_id,body").ilike("body", pattern).limit(limit),
            supabase.from("task_reports").select("id,task_id,title,body").or(`title.ilike.${pattern},body.ilike.${pattern}`).limit(limit),
        ]);

        return {
            tasks: (tasks.data ?? []).map((r) => ({ 
                id: r.id, 
                title: r.title, 
                snippet: r.description 
            })),
            assignments: (assignments.data ?? []).map((r) => ({ 
                id: r.id, 
                title: r.title, 
                snippet: r.instructions 
            })),
            notes: (notes.data ?? []).map((r) => ({
                id: r.id,
                contextType: r.context_type,
                contextId: r.context_id,
                snippet: r.body,
            })),
            reports: (reports.data ?? []).map((r) => ({ 
                id: r.id, 
                taskId: r.task_id, 
                title: r.title, 
                snippet: r.body 
            })),
        };
    },
};