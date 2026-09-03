import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase submission row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @returns {Object} Mapped submission object.
 */
function mapSubmissionRow(row) {
    return { 
        id: row.id, 
        assignmentId: row.assignment_id, 
        studentId: row.student_id, 
        type: row.type, 
        url: row.url, 
        note: row.note, 
        createdAt: row.created_at 
    };
}

/**
 * Data provider for assignment submissions, handling CRUD operations with Supabase.
 * 
 * @type {{
 *   listByAssignment: (assignmentId: string|number) => Promise<Array>,
 *   create: (params: { assignmentId: string|number, url: string, note?: string }) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>
 * }}
 */
export const submissionsProvider = {

    /**
     * Lists all submissions for an assignment, newest first.
     * 
     * @param {string|number} assignmentId
     * @returns {Promise<Array>}
     */
    async listByAssignment(assignmentId) {
        const { data, error } = await supabase
            .from("assignment_submissions")
            .select("*")
            .eq("assignment_id", assignmentId)
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data.map(mapSubmissionRow);
    },

    /**
     * Creates a new submission for an assignment.
     * 
     * @param {Object} params
     * @param {string} params.assignmentId
     * @param {string} params.url - Submission URL (GitHub, CodeSandbox, etc.).
     * @param {string} [params.note] - Optional note.
     * @returns {Promise<Object>} Created submission.
     */
    async create({ assignmentId, url, note }) {
        const { data: userData } = await supabase.auth.getUser();
        const { data, error } = await supabase
            .from("assignment_submissions")
            .insert({ 
                assignment_id: assignmentId, 
                student_id: userData.user.id, 
                url, 
                note: note || null 
            })
            .select()
            .single();
        if (error) throw error;
        return mapSubmissionRow(data);
    },

    /**
     * Deletes a submission by ID.
     * 
     * @param {string|number} id - Submission ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("assignment_submissions").delete().eq("id", id);
        if (error) throw error;
    },
};