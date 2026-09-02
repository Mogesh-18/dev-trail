import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { AssignmentService } from "@/features/assignments/services/assignment.service";

const ASSIGNMENTS_KEY = ["assignments"];
const TASK_LINKS_KEY = ["assignment-task-links"];

export function useAssignments() {
    return useQuery({ queryKey: ASSIGNMENTS_KEY, queryFn: AssignmentService.list });
}

export function useAssignmentsPaginated(pageSize = 10) {
    // Prefix-matches ASSIGNMENTS_KEY, so every mutation below that invalidates
    // ["assignments"] refreshes this list too — no extra invalidation needed.
    return useCursorPagination({
        queryKey: [...ASSIGNMENTS_KEY, "infinite"],
        fetchPage: (cursor) => AssignmentService.listPage({ cursor, pageSize }),
    });
}

export function useAssignment(id) {
    return useQuery({
        queryKey: ["assignment", id],
        queryFn: () => AssignmentService.getById(id),
        enabled: !!id,
    });
}

export function useAssignmentTaskLinks() {
    return useQuery({ queryKey: TASK_LINKS_KEY, queryFn: AssignmentService.listTaskLinks });
}

export function useCreateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => AssignmentService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: TASK_LINKS_KEY });
        },
    });
}

export function useUpdateAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }) => AssignmentService.update(id, input),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: TASK_LINKS_KEY });
            queryClient.invalidateQueries({ queryKey: ["assignment", id] });
        },
    });
}

export function useUpdateAssignmentStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }) => AssignmentService.updateStatus(id, status),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY });
            queryClient.invalidateQueries({ queryKey: ["assignment", id] });
        },
    });
}

export function useDeleteAssignment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => AssignmentService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ASSIGNMENTS_KEY }),
    });
}

export function useAssignmentResources(assignmentId) {
    return useQuery({
        queryKey: ["assignment-resources", assignmentId],
        queryFn: () => AssignmentService.listResources(assignmentId),
        enabled: !!assignmentId,
    });
}

export function useAddLinkResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => AssignmentService.addLinkResource(assignmentId, input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignment-resources", assignmentId] }),
    });
}

export function useUploadFileResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file) => AssignmentService.uploadFileResource(assignmentId, file),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignment-resources", assignmentId] }),
    });
}

export function useRemoveResource(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (resource) => AssignmentService.removeResource(resource),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignment-resources", assignmentId] }),
    });
}