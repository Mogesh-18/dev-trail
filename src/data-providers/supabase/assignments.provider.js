import { supabase } from "@/lib/supabase";

/**
 * Maps a Supabase assignment row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.title
 * @param {string} row.instructions
 * @param {string} row.requirements
 * @param {string} row.acceptance_criteria
 * @param {string} row.status
 * @param {string} row.deadline
 * @param {number} row.estimated_minutes
 * @param {string} row.created_at
 * @param {string} row.updated_at
 * @returns {Object} Mapped assignment.
 */
function mapAssignmentRow(row) {
    return {
        id: row.id,
        title: row.title,
        instructions: row.instructions,
        requirements: row.requirements,
        acceptanceCriteria: row.acceptance_criteria,
        status: row.status,
        deadline: row.deadline,
        estimatedMinutes: row.estimated_minutes,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/**
 * Maps a Supabase resource row to the application entity.
 * 
 * @param {Object} row - Raw Supabase row.
 * @param {string} row.id
 * @param {string} row.assignment_id
 * @param {string} row.type
 * @param {string} row.url
 * @param {string} row.label
 * @param {string} row.created_at
 * @returns {Object} Mapped resource.
 */
function mapResourceRow(row) {
    return {
        id: row.id,
        assignmentId: row.assignment_id,
        type: row.type,
        url: row.url,
        label: row.label,
        createdAt: row.created_at,
    };
}

export const assignmentsProvider = {

    /**
     * Fetches all assignments, newest first.
     * 
     * @returns {Promise<Array>} List of assignments.
     * @throws {Error} If the query fails.
     */
    async list() {
        const { data, error } = await supabase.from("assignments").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return data.map(mapAssignmentRow);
    },

    /**
     * Fetches a single assignment by ID.
     * 
     * @param {string|number} id - Assignment ID.
     * @returns {Promise<Object>} The assignment.
     * @throws {Error} If not found or query fails.
     */
    async getById(id) {
        const { data, error } = await supabase.from("assignments").select("*").eq("id", id).single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

    /**
     * Creates a new assignment.
     * 
     * @param {Object} input - Assignment data.
     * @param {string} input.title
     * @param {string} [input.instructions]
     * @param {string} [input.requirements]
     * @param {string} [input.acceptanceCriteria]
     * @param {string} [input.deadline]
     * @param {number} [input.estimatedMinutes]
     * @returns {Promise<Object>} Created assignment.
     */
    async create(input) {
        const { data, error } = await supabase
            .from("assignments")
            .insert({
                title: input.title,
                instructions: input.instructions || null,
                requirements: input.requirements || null,
                acceptance_criteria: input.acceptanceCriteria || null,
                deadline: input.deadline || null,
                estimated_minutes: input.estimatedMinutes ?? null,
            })
            .select()
            .single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

    /**
     * Updates an existing assignment.
     * 
     * @param {string|number} id - Assignment ID.
     * @param {Object} input - Fields to update (same shape as `create`).
     * @returns {Promise<Object>} Updated assignment.
     */
    async update(id, input) {
        const { data, error } = await supabase
            .from("assignments")
            .update({
                title: input.title,
                instructions: input.instructions || null,
                requirements: input.requirements || null,
                acceptance_criteria: input.acceptanceCriteria || null,
                deadline: input.deadline || null,
                estimated_minutes: input.estimatedMinutes ?? null,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

    /**
     * Deletes an assignment by ID.
     * 
     * @param {string|number} id - Assignment ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        const { error } = await supabase.from("assignments").delete().eq("id", id);
        if (error) throw error;
    },

    /**
     * Fetches all task links for assignments.
     * 
     * @returns {Promise<Array<{ assignmentId: string, taskId: string }>>}
     */
    async listTaskLinks() {
        const { data, error } = await supabase.from("assignment_task_links").select("*");
        if (error) throw error;
        return data.map((row) => ({ 
            assignmentId: row.assignment_id, 
            taskId: row.task_id 
        }));
    },

    /**
     * Replaces all task links for an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @param {Array<string|number>} taskIds - New list of task IDs.
     * @returns {Promise<void>}
     */
    async setTaskLinks(assignmentId, taskIds) {
        const { error: deleteError } = await supabase.from("assignment_task_links").delete().eq("assignment_id", assignmentId);
        if (deleteError) throw deleteError;
        if (taskIds.length === 0) return;
        const { error: insertError } = await supabase.from("assignment_task_links").insert(taskIds.map((taskId) => ({ 
            assignment_id: assignmentId, 
            task_id: taskId 
        })));
        if (insertError) throw insertError;
    },

    /**
     * Fetches resources for a given assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @returns {Promise<Array>} List of resources.
     */
    async listResources(assignmentId) {
        const { data, error } = await supabase.from("assignment_resources").select("*").eq("assignment_id", assignmentId).order("created_at", { ascending: true });
        if (error) throw error;
        return data.map(mapResourceRow);
    },

    /**
     * Adds a link resource to an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @param {Object} params - Link data.
     * @param {string} params.url - The URL.
     * @param {string} params.label - Display label.
     * @returns {Promise<Object>} Created resource.
     */
    async addLinkResource(assignmentId, { url, label }) {
        const { data, error } = await supabase.from("assignment_resources").insert({ 
            assignment_id: assignmentId, 
            type: "link", 
            url, 
            label 
        }).select().single();
        if (error) throw error;
        return mapResourceRow(data);
    },

    /**
     * Uploads a file as a resource for an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @param {File} file - The file to upload.
     * @returns {Promise<Object>} Created resource.
     */
    async uploadFileResource(assignmentId, file) {
        const path = `${assignmentId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("assignment-resources").upload(path, file);
        if (uploadError) throw uploadError;

        const { data, error } = await supabase.from("assignment_resources")
            .insert({ 
                assignment_id: assignmentId, 
                type: "file", 
                url: path, 
                label: file.name 
            })
            .select()
            .single();
        if (error) throw error;
        return mapResourceRow(data);
    },

    /**
     * Generates a signed URL for a resource file.
     * 
     * @param {string} path - Storage path.
     * @returns {Promise<string>} Signed URL (valid for 1 hour).
     */
    async getResourceDownloadUrl(path) {
        const { data, error } = await supabase.storage.from("assignment-resources").createSignedUrl(path, 60 * 60);
        if (error) throw error;
        return data.signedUrl;
    },

    /**
     * Deletes a resource (and its file if it is a file type).
     * 
     * @param {Object} resource - The resource object (must have `id` and `type`/`url`).
     * @returns {Promise<void>}
     */
    async removeResource(resource) {
        const { error } = await supabase.from("assignment_resources").delete().eq("id", resource.id);
        if (error) throw error;
        if (resource.type === "file") {
            await supabase.storage.from("assignment-resources").remove([resource.url]);
        }
    },

    /**
     * Updates the status of an assignment.
     * 
     * @param {string|number} id - Assignment ID.
     * @param {string} status - New status.
     * @returns {Promise<Object>} Updated assignment.
     */
    async updateStatus(id, status) {
        const { data, error } = await supabase.from("assignments")
            .update({ 
                status, 
                updated_at: new Date().toISOString() 
            }).eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

    /**
     * Fetches a paginated list of assignments (cursor‑based).
     * 
     * @param {Object} params - Pagination options.
     * @param {string} [params.cursor] - `created_at` timestamp to fetch older items.
     * @param {number} [params.pageSize=10] - Number of items per page.
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    async listPage({ cursor, pageSize = 10 }) {
        let query = supabase.from("assignments").select("*").order("created_at", { ascending: false }).limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapAssignmentRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { 
            items, 
            nextCursor 
        };
    },
};