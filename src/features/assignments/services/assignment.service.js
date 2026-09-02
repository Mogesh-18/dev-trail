import { AssignmentRepository } from "@/repositories/assignment.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const AssignmentService = {
    list: () => AssignmentRepository.list(),
    getById: (id) => AssignmentRepository.getById(id),
    listTaskLinks: () => AssignmentRepository.listTaskLinks(),
    listResources: (assignmentId) => AssignmentRepository.listResources(assignmentId),
    getResourceDownloadUrl: (path) => AssignmentRepository.getResourceDownloadUrl(path),

    async create(input) {
        const assignment = await AssignmentRepository.create(input);
        if (input.taskIds?.length) {
            await AssignmentRepository.setTaskLinks(assignment.id, input.taskIds);
        }
        emit(EVENTS.ASSIGNMENT_CREATED, { assignmentId: assignment.id });
        return assignment;
    },

    async update(id, input) {
        const assignment = await AssignmentRepository.update(id, input);
        await AssignmentRepository.setTaskLinks(id, input.taskIds ?? []);
        emit(EVENTS.ASSIGNMENT_UPDATED, { assignmentId: id });
        return assignment;
    },

    async remove(id) {
        await AssignmentRepository.remove(id);
    },

    addLinkResource: (assignmentId, input) => AssignmentRepository.addLinkResource(assignmentId, input),
    uploadFileResource: (assignmentId, file) => AssignmentRepository.uploadFileResource(assignmentId, file),
    removeResource: (resource) => AssignmentRepository.removeResource(resource),
};