import { supabase } from "@/lib/supabase";

function mapProgressRow(row) {
    return {
        id: row.id,
        taskId: row.task_id,
        studentId: row.student_id,
        status: row.status,
        startedAt: row.started_at,
        completedAt: row.completed_at,
    };
}

export const progressProvider = {
    async list() {
        const { data, error } = await supabase.from("progress").select("*");
        if (error) throw error;
        return data.map(mapProgressRow);
    },

    async upsertStatus(taskId, status) {
        const { data: userData } = await supabase.auth.getUser();
        const timestamps = {};
        if (status === "in_progress") timestamps.started_at = new Date().toISOString();
        if (status === "completed") timestamps.completed_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("progress")
            .upsert(
                { student_id: userData.user.id, task_id: taskId, status, ...timestamps },
                { onConflict: "student_id,task_id" }
            )
            .select()
            .single();
        if (error) throw error;
        return mapProgressRow(data);
    },

    async clearStatus(taskId) {
        const { data: userData } = await supabase.auth.getUser();
        const { error } = await supabase
            .from("progress")
            .delete()
            .eq("student_id", userData.user.id)
            .eq("task_id", taskId);
        if (error) throw error;
    },
};