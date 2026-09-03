import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/features/tasks/services/task.service";
import { TaskRepository } from "@/repositories/task.repository";

/**
 * TanStack Query key for fetching all tasks.
 * 
 * @type {[string]}
 */
const TASKS_KEY = ["tasks"];

/**
 * TanStack Query key for fetching task dependency relationships.
 * 
 * @type {[string]}
 */
const DEPENDENCIES_KEY = ["task-dependencies"];

/**
 * Fetches all tasks (ordered by `order_index`).
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult<Array>}
 */
export function useTasks() {
    return useQuery({ 
        queryKey: TASKS_KEY, 
        queryFn: TaskService.list 
    });
}

/**
 * Fetches all task dependency links.
 * 
 * @returns {import('@tanstack/react-query').UseQueryResult<Array<{ taskId: string, prerequisiteTaskId: string }>>}
 */
export function useTaskDependencies() {
    return useQuery({ 
        queryKey: DEPENDENCIES_KEY, 
        queryFn: TaskService.listDependencies 
    });
}

/**
 * Mutation for creating a new task.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => TaskService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: TASKS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: DEPENDENCIES_KEY 
            });
        },
    });
}

/**
 * Mutation for updating a task.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }) => TaskService.update(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ 
                queryKey: TASKS_KEY 
            });
            queryClient.invalidateQueries({ 
                queryKey: DEPENDENCIES_KEY 
            });
        },
    });
}

/**
 * Mutation for deleting a task.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => TaskService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: TASKS_KEY 
        }),
    });
}

/**
 * Mutation for reordering tasks by submitting a list of task IDs in the new order.
 * 
 * @returns {import('@tanstack/react-query').UseMutationResult}
 */
export function useReorderTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds) => TaskService.reorder(orderedIds),
        onSuccess: () => queryClient.invalidateQueries({ 
            queryKey: TASKS_KEY 
        }),
    });
}

/**
 * Fetches a single task by ID.
 * 
 * @param {string|number} id - Task ID.
 * @returns {import('@tanstack/react-query').UseQueryResult<Object>}
 */
export function useTask(id) {
    return useQuery({
        queryKey: [
            "task", id
        ],
        queryFn: () => TaskRepository.getById(id),
        enabled: !!id,
    });
}