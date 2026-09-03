import { AssignmentRepository } from "@/repositories/assignment.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const AssignmentService = {

    /**
     * Fetches all assignments.
     * 
     * @returns {Promise<Array>}
     */
    list: () => AssignmentRepository.list(),

    /**
     * Paginated list of assignments.
     * 
     * @param {Object} params
     * @param {string} [params.cursor] - `created_at` cursor.
     * @param {number} [params.pageSize] - Items per page.
     * @returns {Promise<{ items: Array, nextCursor: string|null }>}
     */
    listPage: (params) => AssignmentRepository.listPage(params),

    /**
     * Fetches a single assignment by ID.
     * 
     * @param {string|number} id - Assignment ID.
     * @returns {Promise<Object>}
     */
    getById: (id) => AssignmentRepository.getById(id),

    /**
     * Fetches all assignment–task links.
     * 
     * @returns {Promise<Array<{ assignmentId: string, taskId: string }>>}
     */
    listTaskLinks: () => AssignmentRepository.listTaskLinks(),

    /**
     * Fetches resources for an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @returns {Promise<Array>}
     */
    listResources: (assignmentId) => AssignmentRepository.listResources(assignmentId),

    /**
     * Generates a signed URL for a resource file.
     * 
     * @param {string} path - Storage path.
     * @returns {Promise<string>}
     */
    getResourceDownloadUrl: (path) => AssignmentRepository.getResourceDownloadUrl(path),

    /**
     * Creates a new assignment, links tasks, and emits `ASSIGNMENT_CREATED` event.
     * 
     * @param {Object} input - Assignment data (title, instructions, etc.) plus `taskIds`.
     * @returns {Promise<Object>} Created assignment.
     */
    async create(input) {
        const assignment = await AssignmentRepository.create(input);
        if (input.taskIds?.length) {
            await AssignmentRepository.setTaskLinks(assignment.id, input.taskIds);
        }
        emit(EVENTS.ASSIGNMENT_CREATED, { 
            assignmentId: assignment.id 
        });
        return assignment;
    },

    /**
     * Updates an assignment, links tasks, and emits `ASSIGNMENT_UPDATED` event.
     * 
     * @param {string|number} id - Assignment ID.
     * @param {Object} input - Updated fields (same shape as `create`).
     * @returns {Promise<Object>} Updated assignment.
     */
    async update(id, input) {
        const assignment = await AssignmentRepository.update(id, input);
        await AssignmentRepository.setTaskLinks(id, input.taskIds ?? []);
        emit(EVENTS.ASSIGNMENT_UPDATED, { 
            assignmentId: id 
        });
        return assignment;
    },

    /**
     * Updates only the assignment status and emits `ASSIGNMENT_SUBMITTED` or `ASSIGNMENT_COMPLETED` as appropriate.
     * 
     * @param {string|number} id - Assignment ID.
     * @param {string} status - New status.
     * @returns {Promise<Object>} Updated assignment.
     */
    async updateStatus(id, status) {
        const assignment = await AssignmentRepository.updateStatus(id, status);
        if (status === "submitted") emit(EVENTS.ASSIGNMENT_SUBMITTED, { assignmentId: id });
        if (status === "completed") emit(EVENTS.ASSIGNMENT_COMPLETED, { assignmentId: id });
        return assignment;
    },

    /**
     * Deletes an assignment by ID.
     * 
     * @param {string|number} id - Assignment ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await AssignmentRepository.remove(id);
    },

    /**
     * Adds a link resource to an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @param {Object} input - { url, label }.
     * @returns {Promise<Object>} Created resource.
     */
    addLinkResource: (assignmentId, input) => AssignmentRepository.addLinkResource(assignmentId, input),

    /**
     * Uploads a file resource to an assignment.
     * 
     * @param {string|number} assignmentId - Assignment ID.
     * @param {File} file - File to upload.
     * @returns {Promise<Object>} Created resource.
     */
    uploadFileResource: (assignmentId, file) => AssignmentRepository.uploadFileResource(assignmentId, file),

    /**
     * Removes a resource (and its file if it exists).
     * 
     * @param {Object} resource - Resource object.
     * @returns {Promise<void>}
     */
    removeResource: (resource) => AssignmentRepository.removeResource(resource),
};