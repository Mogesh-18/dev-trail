import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { AssignmentService } from "@/features/assignments/services/assignment.service";

/**
 * TanStack Query key for fetching all assignments.
 * 
 * @type {[string]}
 */
const ASSIGNMENTS_KEY = ["assignments"];

/**
 * TanStack Query key for fetching assignment–task link relationships.
 * 
 * @type {[string]}
 */
const TASK_LINKS_KEY = ["assignment-task-links"];

/**
 * Fetches all assignments (non‑paginated).
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useAssignments() {
    return useQuery({ 
        queryKey: ASSIGNMENTS_KEY, 
        queryFn: AssignmentService.list 
    });
}

/**
 * Paginated assignments list using cursor‑based infinite query.
 * 
 * @param {number} [pageSize=10] - Items per page.
 * @returns {import('@tanstack/react-query').UseInfiniteQueryResult & { items: Array }}
 */
export function useAssignmentsPaginated(pageSize = 10) {
    return useCursorPagination({
        queryKey: [
            ...ASSIGNMENTS_KEY, "infinite"
        ],
        fetchPage: (cursor) => AssignmentService.listPage({ 
            cursor, 
            pageSize 
        }),
    });
}

/**
 * Fetches a single assignment by ID.
 * 
 * @param {string|number} id - Assignment ID.
 * @returns {import('@tanstack/react-query').UseQueryResult<Object>}
 */
export function useAssignment(id) {
    return useQuery({
        queryKey: [
            "assignment", id
        ],
        queryFn: () => AssignmentService.getById(id),
        enabled: !!id,
    });
}

/**
 * Fetches all assignment–task link relationships.
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useAssignmentTaskLinks() {
    return useQuery({ 
        queryKey: TASK_LINKS_KEY, 
        queryFn: AssignmentService.listTaskLinks 
    });
}

/**
 * Mutation for creating a new assignment.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useCreateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => AssignmentService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: ASSIGNMENTS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: TASK_LINKS_KEY 
            });
        },
    });
}

/**
 * Mutation for updating an assignment.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useUpdateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }) => AssignmentService.update(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ 
                queryKey: ASSIGNMENTS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: TASK_LINKS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: ["assignment", id] 
            });
        },
    });
}

/**
 * Mutation for updating only the status of an assignment.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useUpdateAssignmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => AssignmentService.updateStatus(id, status),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ 
                queryKey: ASSIGNMENTS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: ["assignment", id] 
            });
        },
    });
}

/**
 * Mutation for deleting an assignment.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useDeleteAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => AssignmentService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ASSIGNMENTS_KEY 
        }),
    });
}

/**
 * Fetches resources (links/files) for a given assignment.
 * 
 * @param {string|number} assignmentId - Assignment ID.
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useAssignmentResources(assignmentId) {
    return useQuery({
        queryKey: [
            "assignment-resources", assignmentId
        ],
        queryFn: () => AssignmentService.listResources(assignmentId),
        enabled: !!assignmentId,
    });
}

/**
 * Mutation for adding a link resource to an assignment.
 * 
 * @param {string|number} assignmentId - Assignment ID.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useAddLinkResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => AssignmentService.addLinkResource(assignmentId, input),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["assignment-resources", assignmentId] 
        }),
    });
}

/**
 * Mutation for uploading a file resource to an assignment.
 * 
 * @param {string|number} assignmentId - Assignment ID.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useUploadFileResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file) => AssignmentService.uploadFileResource(assignmentId, file),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["assignment-resources", assignmentId] 
        }),
    });
}

/**
 * Mutation for removing a resource from an assignment.
 * 
 * @param {string|number} assignmentId - Assignment ID.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useRemoveResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (resource) => AssignmentService.removeResource(resource),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["assignment-resources", assignmentId] 
        }),
    });
}