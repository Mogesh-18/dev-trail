import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { ProgressService } from "@/features/progress/services/progress.service";
import { ActivityService } from "@/features/progress/services/activity.service";

/**
 * Fetches all progress records.
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useProgress() {
    return useQuery({ 
        queryKey: ["progress"], 
        queryFn: ProgressService.list 
    });
}

/**
 * Fetches the most recent activity entries.
 * 
 * @param {number} [limit=50] - Max number of entries.
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useActivity(limit = 50) {
    return useQuery({ 
        queryKey: [
            "activity", limit
        ], 
        queryFn: () => ActivityService.list(limit) 
    });
}

/**
 * Paginated activity feed using cursor‑based infinite query.
 * 
 * @param {number} [pageSize=10] - Items per page.
 * @returns {Object} Result from `useCursorPagination` plus `items`.
 */
export function useActivityPaginated(pageSize = 10) {
    return useCursorPagination({
        queryKey: [
            "activity", "infinite"
        ],
        fetchPage: (cursor) => ActivityService.listPage({ 
            cursor, 
            pageSize 
        }),
    });
}

/**
 * Mutation for starting a task (status → `in_progress`).
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useStartTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.startTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["progress"] 
        }),
    });
}

/**
 * Mutation for completing a task (status → `completed`).
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useCompleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.completeTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["progress"] 
        }),
    });
}

/**
 * Mutation for reopening a task (deletes the progress row, allowing the status to be recalculated).
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useReopenTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.reopenTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["progress"] 
        }),
    });
}