import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { ReportService } from "@/features/reports/services/report.service";

/**
 * Paginated reports for a specific task using cursor-based infinite query.
 * 
 * @param {string} taskId
 * @param {number} [pageSize=5]
 * @returns {Object} Result from `useCursorPagination` plus `items`.
 */
export function useReports(taskId, pageSize = 5) {
    return useCursorPagination({
        queryKey: ["reports", taskId],
        fetchPage: (cursor) => ReportService.listByTaskPage({ 
            taskId, 
            cursor, 
            pageSize 
        }),
        enabled: !!taskId,
    });
}

/**
 * Mutation for adding a report to a task.
 * 
 * @param {string} taskId
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useAddReport(taskId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ title, body }) => ReportService.create({ 
            taskId, 
            title, 
            body 
        }),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["reports", taskId] 
        }),
    });
}

/**
 * Mutation for deleting a report from a task.
 * 
 * @param {string} taskId
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useDeleteReport(taskId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => ReportService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["reports", taskId] 
        }),
    });
}