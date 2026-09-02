import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TaskService } from "@/features/tasks/services/task.service";
import { TaskRepository } from "@/repositories/task.repository";

const TASKS_KEY = ["tasks"];
const DEPENDENCIES_KEY = ["task-dependencies"];

export function useTasks() {
    return useQuery({ queryKey: TASKS_KEY, queryFn: TaskService.list });
}

export function useTaskDependencies() {
    return useQuery({ queryKey: DEPENDENCIES_KEY, queryFn: TaskService.listDependencies });
}

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input) => TaskService.create(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            queryClient.invalidateQueries({ queryKey: DEPENDENCIES_KEY });
        },
    });
}

export function useUpdateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, input }) => TaskService.update(id, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TASKS_KEY });
            queryClient.invalidateQueries({ queryKey: DEPENDENCIES_KEY });
        },
    });
}

export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => TaskService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
    });
}

export function useReorderTasks() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (orderedIds) => TaskService.reorder(orderedIds),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
    });
}

export function useTask(id) {
    return useQuery({
        queryKey: ["task", id],
        queryFn: () => TaskRepository.getById(id),
        enabled: !!id,
    });
}