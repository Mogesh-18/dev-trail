import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TemplateService } from "@/features/tasks/services/template.service";

/**
 * TanStack Query key for fetching task templates.
 * 
 * @type {[string]}
 */
const TEMPLATES_KEY = ["task-templates"];

/**
 * Fetches all task templates.
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useTemplates() {
    return useQuery({
        queryKey: TEMPLATES_KEY,
        queryFn: TemplateService.list
    });
}

/**
 * Mutation for creating a new task template.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useCreateTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => TemplateService.create(input),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: TEMPLATES_KEY 
        }),
    });
}

/**
 * Mutation for deleting a task template.
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useDeleteTemplate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => TemplateService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({
            queryKey: TEMPLATES_KEY
        }),
    });
}