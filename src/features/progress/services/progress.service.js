import { ProgressRepository } from "@/repositories/progress.repository";
import { emit, EVENTS } from "@/app/events/bus";

export const ProgressService = {
    list: () => ProgressRepository.list(),

    async startTask(taskId) {
        const progress = await ProgressRepository.upsertStatus(taskId, "in_progress");
        emit(EVENTS.TASK_STARTED, { taskId });
        return progress;
    },

    async completeTask(taskId) {
        const progress = await ProgressRepository.upsertStatus(taskId, "completed");
        emit(EVENTS.TASK_COMPLETED, { taskId });
        return progress;
    },

    skipTask: (taskId) => ProgressRepository.upsertStatus(taskId, "skipped"),

    // Reopening deletes the stored row entirely rather than setting a status,
    // so deriveTaskStatus() falls back to recalculating locked/available from
    // prerequisites again instead of getting stuck on a stale value.
    reopenTask: (taskId) => ProgressRepository.clearStatus(taskId),
};