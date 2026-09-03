import { assignmentsProvider } from "@/data-providers/supabase/assignments.provider";

/**
 * Repository wrapper for assignment and resource operations.
 * Delegates all calls to `assignmentsProvider`.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   listPage: (params: { cursor?: string, pageSize?: number }) => Promise<{ items: Array, nextCursor: string | null }>,
 *   getById: (id: string|number) => Promise<Object>,
 *   create: (input: Object) => Promise<Object>,
 *   update: (id: string|number, input: Object) => Promise<Object>,
 *   updateStatus: (id: string|number, status: string) => Promise<Object>,
 *   remove: (id: string|number) => Promise<void>,
 *   listTaskLinks: () => Promise<Array<{ assignmentId: string, taskId: string }>>,
 *   setTaskLinks: (assignmentId: string|number, taskIds: Array<string|number>) => Promise<void>,
 *   listResources: (assignmentId: string|number) => Promise<Array>,
 *   addLinkResource: (assignmentId: string|number, input: { url: string, label: string }) => Promise<Object>,
 *   uploadFileResource: (assignmentId: string|number, file: File) => Promise<Object>,
 *   getResourceDownloadUrl: (path: string) => Promise<string>,
 *   removeResource: (resource: Object) => Promise<void>
 * }}
 */
export const AssignmentRepository = {
    list: () => assignmentsProvider.list(),
    listPage: (params) => assignmentsProvider.listPage(params),
    getById: (id) => assignmentsProvider.getById(id),
    create: (input) => assignmentsProvider.create(input),
    update: (id, input) => assignmentsProvider.update(id, input),
    updateStatus: (id, status) => assignmentsProvider.updateStatus(id, status),
    remove: (id) => assignmentsProvider.remove(id),
    listTaskLinks: () => assignmentsProvider.listTaskLinks(),
    setTaskLinks: (assignmentId, taskIds) => assignmentsProvider.setTaskLinks(assignmentId, taskIds),
    listResources: (assignmentId) => assignmentsProvider.listResources(assignmentId),
    addLinkResource: (assignmentId, input) => assignmentsProvider.addLinkResource(assignmentId, input),
    uploadFileResource: (assignmentId, file) => assignmentsProvider.uploadFileResource(assignmentId, file),
    getResourceDownloadUrl: (path) => assignmentsProvider.getResourceDownloadUrl(path),
    removeResource: (resource) => assignmentsProvider.removeResource(resource),
};