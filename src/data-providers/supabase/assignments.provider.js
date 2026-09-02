import { supabase } from "@/lib/supabase";

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
    async list() {
        const { data, error } = await supabase.from("assignments").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return data.map(mapAssignmentRow);
    },

    async getById(id) {
        const { data, error } = await supabase.from("assignments").select("*").eq("id", id).single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

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

    async remove(id) {
        const { error } = await supabase.from("assignments").delete().eq("id", id);
        if (error) throw error;
    },

    async listTaskLinks() {
        const { data, error } = await supabase.from("assignment_task_links").select("*");
        if (error) throw error;
        return data.map((row) => ({ assignmentId: row.assignment_id, taskId: row.task_id }));
    },

    async setTaskLinks(assignmentId, taskIds) {
        const { error: deleteError } = await supabase
            .from("assignment_task_links")
            .delete()
            .eq("assignment_id", assignmentId);
        if (deleteError) throw deleteError;
        if (taskIds.length === 0) return;
        const { error: insertError } = await supabase
            .from("assignment_task_links")
            .insert(taskIds.map((taskId) => ({ assignment_id: assignmentId, task_id: taskId })));
        if (insertError) throw insertError;
    },

    async listResources(assignmentId) {
        const { data, error } = await supabase
            .from("assignment_resources")
            .select("*")
            .eq("assignment_id", assignmentId)
            .order("created_at", { ascending: true });
        if (error) throw error;
        return data.map(mapResourceRow);
    },

    async addLinkResource(assignmentId, { url, label }) {
        const { data, error } = await supabase
            .from("assignment_resources")
            .insert({ assignment_id: assignmentId, type: "link", url, label })
            .select()
            .single();
        if (error) throw error;
        return mapResourceRow(data);
    },

    async uploadFileResource(assignmentId, file) {
        const path = `${assignmentId}/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("assignment-resources").upload(path, file);
        if (uploadError) throw uploadError;

        const { data, error } = await supabase
            .from("assignment_resources")
            .insert({ assignment_id: assignmentId, type: "file", url: path, label: file.name })
            .select()
            .single();
        if (error) throw error;
        return mapResourceRow(data);
    },

    async getResourceDownloadUrl(path) {
        const { data, error } = await supabase.storage.from("assignment-resources").createSignedUrl(path, 60 * 60);
        if (error) throw error;
        return data.signedUrl;
    },

    async removeResource(resource) {
        const { error } = await supabase.from("assignment_resources").delete().eq("id", resource.id);
        if (error) throw error;
        if (resource.type === "file") {
            await supabase.storage.from("assignment-resources").remove([resource.url]);
        }
    },

    async updateStatus(id, status) {
        const { data, error } = await supabase
            .from("assignments")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id)
            .select()
            .single();
        if (error) throw error;
        return mapAssignmentRow(data);
    },

    async listPage({ cursor, pageSize = 10 }) {
        let query = supabase
            .from("assignments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(pageSize);
        if (cursor) query = query.lt("created_at", cursor);

        const { data, error } = await query;
        if (error) throw error;
        const items = data.map(mapAssignmentRow);
        const nextCursor = items.length === pageSize ? items[items.length - 1].createdAt : null;
        return { items, nextCursor };
    },
};