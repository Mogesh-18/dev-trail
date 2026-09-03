import { ProgressRepository } from "@/repositories/progress.repository";
import { emit, EVENTS } from "@/app/events/bus";

/**
 * Service layer for progress operations, delegating to `ProgressRepository`
 * and emitting events on status changes.
 * 
 * @type {{
 *   list: () => Promise<Array>,
 *   startTask: (taskId: string|number) => Promise<Object>,
 *   completeTask: (taskId: string|number) => Promise<Object>,
 *   skipTask: (taskId: string|number) => Promise<Object>,
 *   reopenTask: (taskId: string|number) => Promise<void>
 * }}
 */
export const ProgressService = {

    /**
     * Fetches all progress records.
     * 
     * @returns {Promise<Array>}
     */
    list: () => ProgressRepository.list(),

    /**
     * Marks a task as "in progress" and emits `TASK_STARTED` event.
     * 
     * @param {string|number} taskId
     * @returns {Promise<Object>} Updated progress record.
     */
    async startTask(taskId) {
        const progress = await ProgressRepository.upsertStatus(taskId, "in_progress");
        emit(EVENTS.TASK_STARTED, { 
            taskId 
        });
        return progress;
    },

    /**
     * Marks a task as "completed" and emits `TASK_COMPLETED` event.
     * 
     * @param {string|number} taskId
     * @returns {Promise<Object>} Updated progress record.
     */
    async completeTask(taskId) {
        const progress = await ProgressRepository.upsertStatus(taskId, "completed");
        emit(EVENTS.TASK_COMPLETED, { 
            taskId 
        });
        return progress;
    },

    /**
     * Marks a task as "skipped" (no event emitted).
     * 
     * @param {string|number} taskId
     * @returns {Promise<Object>} Updated progress record.
     */
    skipTask: (taskId) => ProgressRepository.upsertStatus(taskId, "skipped"),

    /**
     * Reopens a task by deleting its progress row.
     * This allows `deriveTaskStatuses` to recalculate availability from prerequisites.
     * 
     * @param {string|number} taskId
     * @returns {Promise<void>}
     */
    reopenTask: (taskId) => ProgressRepository.clearStatus(taskId),
};