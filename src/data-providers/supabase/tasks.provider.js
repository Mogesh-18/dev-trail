import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase task row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.title
 * @param {string} row.description
 * @param {string} row.instructions
 * @param {number} row.order_index
 * @param {string} row.status
 * @param {string} row.priority
 * @param {number} row.estimated_minutes
 * @param {string} row.due_date
 * @param {Array} row.learning_objectives
 * @param {string} row.completion_criteria
 * @param {string} row.created_at
 * @param {string} row.updated_at
 * @returns {Object} Mapped task.
 */
function mapTaskRow(row) {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        instructions: row.instructions,
        orderIndex: row.order_index,
        status: row.status,
        priority: row.priority,
        estimatedMinutes: row.estimated_minutes,
        dueDate: row.due_date,
        learningObjectives: row.learning_objectives ?? [],
        completionCriteria: row.completion_criteria,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

export const tasksProvider = {

    /**
     * Fetches all tasks, ordered by `order_index` (ascending).
     * 
     * @returns {Promise<Array>} List of tasks.
     */
    async list() {
        const { data, error } = await supabase.from("tasks").select("*").order("order_index", { ascending: true });
        if (error) throw error;
        return data.map(mapTaskRow);
    },

    /**
     * Fetches a single task by ID.
     * 
     * @param {string|number} id - Task ID.
     * @returns {Promise<Object>} The task.
     */
    async getById(id) {
        const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
        if (error) throw error;
        return mapTaskRow(data);
    },

    /**
     * Creates a new task, automatically assigning the next `order_index`.
     * 
     * @param {Object} input - Task data.
     * @param {string} input.title
     * @param {string} [input.description]
     * @param {string} [input.instructions]
     * @param {string} input.priority
     * @param {number} [input.estimatedMinutes]
     * @param {string} [input.dueDate]
     * @param {string} [input.completionCriteria]
     * @returns {Promise<Object>} Created task.
     */
    async create(input) {
        const { data: maxRow } = await supabase
            .from("tasks")
            .select("order_index")
            .order("order_index", { ascending: false })
            .limit(1)
            .maybeSingle();
        const nextOrderIndex = (maxRow?.order_index ?? -1) + 1;

        const { data, error } = await supabase
            .from("tasks")
            .insert({
                title: input.title,
                description: input.description || null,
                instructions: input.instructions || null,
                priority: input.priority,
                estimated_minutes: input.estimatedMinutes ?? null,
                due_date: input.dueDate || null,
                completion_criteria: input.completionCriteria || null,
                order_index: nextOrderIndex,
            })
            .select()
            .single();
        if (error) throw error;
        return mapTaskRow(data);
    },

    /**
     * Updates an existing task.
     * 
     * @param {string|number} id - Task ID.
     * @param {Object} input - Fields to update (same shape as `create`).
     * @returns {Promise<Object>} Updated task.
     */
    async update(id, input) {
        const { data, error } = await supabase
            .from("tasks")
            .update({
                title: input.title,
                description: input.description || null,
                instructions: input.instructions || null,
                priority: input.priority,
                estimated_minutes: input.estimatedMinutes ?? null,
                due_date: input.dueDate || null,
                completion_criteria: input.completionCriteria || null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return mapTaskRow(data);
    },

    /**
     * Deletes a task by ID.
     * 
     * @param {string|number} id - Task ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) throw error;
    },

    /**
     * Reorders tasks by updating `order_index` for each ID in the list.
     * 
     * @param {Array<string|number>} orderedIds - Task IDs in the new order.
     * @returns {Promise<void>}
     */
    async reorder(orderedIds) {
        await Promise.all(
            orderedIds.map((id, index) => supabase.from("tasks").update({ order_index: index }).eq("id", id))
        );
    },

    /**
     * Fetches all task dependency links.
     * 
     * @returns {Promise<Array<{ taskId: string, prerequisiteTaskId: string }>>}
     */
    async listDependencies() {
        const { data, error } = await supabase.from("task_dependencies").select("*");
        if (error) throw error;
        return data.map((row) => ({ taskId: row.task_id, prerequisiteTaskId: row.prerequisite_task_id }));
    },

    /**
     * Replaces all dependencies for a task.
     * 
     * @param {string|number} taskId - Task ID.
     * @param {Array<string|number>} prerequisiteTaskIds - New prerequisite list.
     * @returns {Promise<void>}
     */
    async setDependencies(taskId, prerequisiteTaskIds) {
        const { error: deleteError } = await supabase.from("task_dependencies").delete().eq("task_id", taskId);
        if (deleteError) throw deleteError;
        if (prerequisiteTaskIds.length === 0) return;
        const { error: insertError } = await supabase.from("task_dependencies").insert(prerequisiteTaskIds.map((prerequisiteTaskId) => ({ 
            task_id: taskId, 
            prerequisite_task_id: prerequisiteTaskId 
        })));
        if (insertError) throw insertError;
    },
};