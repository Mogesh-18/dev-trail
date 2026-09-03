import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase template row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.title
 * @param {string} row.description
 * @param {string} row.instructions
 * @param {string} row.priority
 * @param {number} row.estimated_minutes
 * @param {string} row.completion_criteria
 * @param {string} row.created_at
 * @returns {Object} Mapped template.
 */
function mapTemplateRow(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        instructions: row.instructions,
        priority: row.priority,
        estimatedMinutes: row.estimated_minutes,
        completionCriteria: row.completion_criteria,
        createdAt: row.created_at,
    };
}

/**
 * Data provider for task templates (CRUD operations with Supabase).
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   create: (input: Object) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const templatesProvider = {

    /**
     * Fetches all templates, newest first.
     * 
     * @returns {Promise<Array>} List of templates.
     */
    async list() {
        const { data, error } = await supabase.from("task_templates").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return data.map(mapTemplateRow);
    },

    /**
     * Creates a new task template from the given input.
     * 
     * @param {Object} input - Template data.
     * @param {string} input.title
     * @param {string} [input.description]
     * @param {string} [input.instructions]
     * @param {'low'|'medium'|'high'} input.priority
     * @param {number} [input.estimatedMinutes]
     * @param {string} [input.completionCriteria]
     * @returns {Promise<Object>} Created template.
     */
    async create(input) {
        const { data, error } = await supabase
            .from("task_templates")
            .insert({
                title: input.title,
                description: input.description || null,
                instructions: input.instructions || null,
                priority: input.priority,
                estimated_minutes: input.estimatedMinutes ?? null,
                completion_criteria: input.completionCriteria || null,
            })
            .select()
            .single();
        if (error) throw error;
        return mapTemplateRow(data);
    },

    /**
     * Deletes a template by ID.
     * 
     * @param {string|number} id - Template ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("task_templates").delete().eq("id", id);
        if (error) throw error;
    },
};