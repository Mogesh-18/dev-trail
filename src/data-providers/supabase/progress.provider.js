import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase progress row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.task_id
 * @param {string} row.student_id
 * @param {string} row.status
 * @param {string} row.started_at
 * @param {string} row.completed_at
 * @returns {Object} Mapped progress record.
 */
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

    /**
     * Fetches all progress records.
     * 
     * @returns {Promise<Array>} List of progress entries.
     */
    async list() {
        const { data, error } = await supabase.from("progress").select("*");
        if (error) throw error;
        return data.map(mapProgressRow);
    },

    /**
     * Upserts (insert or update) a progress status for a task and the current student.
     * If status is `in_progress`, sets `started_at`; if `completed`, sets `completed_at`.
     * 
     * @param {string|number} taskId - Task ID.
     * @param {string} status - New status (e.g., "in_progress", "completed").
     * @returns {Promise<Object>} Updated progress record.
     */
    async upsertStatus(taskId, status) {
        const { data: userData } = await supabase.auth.getUser();
        const timestamps = {};
        if (status === "in_progress") timestamps.started_at = new Date().toISOString();
        if (status === "completed") timestamps.completed_at = new Date().toISOString();

        const { data, error } = await supabase
            .from("progress")
            .upsert(
                { 
                    student_id: userData.user.id, 
                    task_id: taskId, 
                    status, 
                    ...timestamps 
                },
                { 
                    onConflict: "student_id,task_id" 
                }
            )
            .select()
            .single();
        if (error) throw error;
        return mapProgressRow(data);
    },

    /**
     * Deletes the progress record for a task (resets status) for the current student.
     * 
     * @param {string|number} taskId - Task ID.
     * @returns {Promise<void>}
     */
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