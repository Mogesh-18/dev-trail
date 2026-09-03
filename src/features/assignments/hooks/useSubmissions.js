import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SubmissionService } from "@/features/assignments/services/submission.service";

/**
 * Fetches all submissions for a given assignment (newest first).
 * 
 * @param {string|number} assignmentId - The assignment ID.
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useSubmissions(assignmentId) {
    return useQuery({
        queryKey: [
            "submissions", assignmentId
        ],
        queryFn: () => SubmissionService.listByAssignment(assignmentId),
        enabled: !!assignmentId,
    });
}

/**
 * Mutation for adding a new submission link to an assignment.
 * 
 * @param {string|number} assignmentId - The assignment ID.
 * @returns {import('@tanstack/react-query').UseMutationResult<
 *   Object,
 *   Error,
 *   { url: string, note?: string }
 * >}
 */
export function useAddSubmission(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ url, note }) => SubmissionService.create({ 
            assignmentId, 
            url, 
            note 
        }),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["submissions", assignmentId] 
        }),
    });
}

/**
 * Mutation for deleting a submission by ID.
 * 
 * @param {string|number} assignmentId - The assignment ID (for cache invalidation).
 * @returns {import('@tanstack/react-query').UseMutationResult<void, Error, string|number>}
 */
export function useDeleteSubmission(assignmentId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => SubmissionService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["submissions", assignmentId] 
        }),
    });
}