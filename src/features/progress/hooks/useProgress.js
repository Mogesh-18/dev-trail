import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCursorPagination } from "@/hooks/use-cursor-pagination";
import { ProgressService } from "@/features/progress/services/progress.service";
import { ActivityService } from "@/features/progress/services/activity.service";

export function useProgress() {
    return useQuery({ queryKey: ["progress"], queryFn: ProgressService.list });
}

export function useActivity(limit = 50) {
    return useQuery({ queryKey: ["activity", limit], queryFn: () => ActivityService.list(limit) });
}

export function useActivityPaginated(pageSize = 10) {
    // Prefix-matches ["activity", ...], which EventListenersProvider already
    // invalidates on TASK_COMPLETED/ASSIGNMENT_SUBMITTED — refreshes for free.
    return useCursorPagination({
        queryKey: ["activity", "infinite"],
        fetchPage: (cursor) => ActivityService.listPage({ cursor, pageSize }),
    });
}

export function useStartTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.startTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
    });
}

export function useCompleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.completeTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
    });
}

export function useReopenTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (taskId) => ProgressService.reopenTask(taskId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["progress"] }),
    });
}