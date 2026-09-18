import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskLinksRepository } from "@/repositories/task-links.repository";

/**
 * Task links — list/add/remove for a single task, non-paginated (a
 * task realistically has a handful of links, not hundreds), matching
 * the simplicity of ResourceList rather than the cursor-paginated
 * Notes/Reports/Activity lists.
 */
export function useTaskLinks(taskId) {
    return useQuery({
        queryKey: ["task-links", taskId],
        queryFn: () => taskLinksRepository.listByTask(taskId),
        enabled: !!taskId,
    });
}

export function useAddTaskLink(taskId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => taskLinksRepository.add(taskId, input),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["task-links", taskId] 
        }),
    });
}

export function useRemoveTaskLink(taskId) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => taskLinksRepository.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: ["task-links", taskId] 
        }),
    });
}