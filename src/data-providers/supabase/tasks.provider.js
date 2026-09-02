import { supabase } from "@/lib/supabase";

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
    async list() {
        const { data, error } = await supabase.from("tasks").select("*").order("order_index", { ascending: true });
        if (error) throw error;
        return data.map(mapTaskRow);
    },

    async getById(id) {
        const { data, error } = await supabase.from("tasks").select("*").eq("id", id).single();
        if (error) throw error;
        return mapTaskRow(data);
    },

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

    async remove(id) {
        const { error } = await supabase.from("tasks").delete().eq("id", id);
        if (error) throw error;
    },

    async reorder(orderedIds) {
        await Promise.all(
            orderedIds.map((id, index) => supabase.from("tasks").update({ order_index: index }).eq("id", id))
        );
    },

    async listDependencies() {
        const { data, error } = await supabase.from("task_dependencies").select("*");
        if (error) throw error;
        return data.map((row) => ({ taskId: row.task_id, prerequisiteTaskId: row.prerequisite_task_id }));
    },

    async setDependencies(taskId, prerequisiteTaskIds) {
        const { error: deleteError } = await supabase.from("task_dependencies").delete().eq("task_id", taskId);
        if (deleteError) throw deleteError;
        if (prerequisiteTaskIds.length === 0) return;
        const { error: insertError } = await supabase
            .from("task_dependencies")
            .insert(prerequisiteTaskIds.map((prerequisiteTaskId) => ({ task_id: taskId, prerequisite_task_id: prerequisiteTaskId })));
        if (insertError) throw insertError;
    },
};