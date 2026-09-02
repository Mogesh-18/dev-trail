import { assignmentsProvider } from "@/data-providers/supabase/assignments.provider";

export const AssignmentRepository = {
    list: () => assignmentsProvider.list(),
    getById: (id) => assignmentsProvider.getById(id),
    create: (input) => assignmentsProvider.create(input),
    update: (id, input) => assignmentsProvider.update(id, input),
    remove: (id) => assignmentsProvider.remove(id),
    listTaskLinks: () => assignmentsProvider.listTaskLinks(),
    setTaskLinks: (assignmentId, taskIds) => assignmentsProvider.setTaskLinks(assignmentId, taskIds),
    listResources: (assignmentId) => assignmentsProvider.listResources(assignmentId),
    addLinkResource: (assignmentId, input) => assignmentsProvider.addLinkResource(assignmentId, input),
    uploadFileResource: (assignmentId, file) => assignmentsProvider.uploadFileResource(assignmentId, file),
    getResourceDownloadUrl: (path) => assignmentsProvider.getResourceDownloadUrl(path),
    removeResource: (resource) => assignmentsProvider.removeResource(resource),
};