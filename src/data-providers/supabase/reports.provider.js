import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase report row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.task_id
 * @param {string} row.student_id
 * @param {string} row.title
 * @param {string} row.body
 * @param {string} row.created_at
 * @returns {Object} Mapped report object.
 */
function mapReportRow(row) {
    return {
        id: row.id,
        taskId: row.task_id,
        studentId: row.student_id,
        title: row.title,
        body: row.body,
        createdAt: row.created_at,
    };
}

/**
 * Data provider for task reports, handling CRUD operations with Supabase.
 * 
 * @type {{
 *   listByTaskPage: (params: { taskId: string, cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string|null }>,
 *   create: (params: { taskId: string, title: string, body: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const reportsProvider = {

    /**
     * Paginated list of reports for a given task (newest first).
     * 
     * @param {Object} params
     * @param {string} params.taskId
     * @param {string} [params.cursor] - `created_at` timestamp for cursor-based pagination.
     * @param {number} [params.pageSize=5]
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    async listByTaskPage({ taskId, cursor, pageSize = 5 }) {
        let query = supabase
            .from("task_reports")
            .select("*")
            .eq("task_id", taskId)
            .order("created_at", { ascending: false })
            .limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapReportRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { 
            items, 
            nextCursor 
        };
    },

    /**
     * Creates a new report for a task.
     * @param {Object} params
     * @param {string} params.taskId
     * @param {string} params.title - Optional title.
     * @param {string} params.body - Report content.
     * @returns {Promise<Object>} Created report.
     */
    async create({ taskId, title, body }) {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("task_reports")
            .insert({ task_id: taskId, student_id: userData.user.id, title: title || null, body })
            .select()
            .single();
        if (error) throw error;
        return mapReportRow(data);
    },

    /**
     * Deletes a report by ID.
     * @param {string|number} id - Report ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("task_reports").delete().eq("id", id);
        if (error) throw error;
    },
};