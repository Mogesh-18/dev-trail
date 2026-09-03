import { TaskRepository } from "@/repositories/task.repository";
import { emit, EVENTS } from "@/app/events/bus";

/**
 * Task Service.
 */
export const TaskService = {

    /**
     * Fetches all tasks.
     * 
     * @returns {Promise<Array>}
     */
    list: () => TaskRepository.list(),

    /**
     * Fetches all dependency relationships.
     * 
     * @returns {Promise<Array<{ taskId: string, prerequisiteTaskId: string }>>}
     */
    listDependencies: () => TaskRepository.listDependencies(),

    /**
     * Creates a new task, sets dependencies, and emits `TASK_CREATED` event.
     * 
     * @param {Object} input - Task data including `prerequisiteTaskIds`.
     * @returns {Promise<Object>} Created task.
     */
    async create(input) {
        const task = await TaskRepository.create(input);
        if (input.prerequisiteTaskIds?.length) {
            await TaskRepository.setDependencies(task.id, input.prerequisiteTaskIds);
        }
        emit(EVENTS.TASK_CREATED, { 
            taskId: task.id 
        });
        return task;
    },

    /**
     * Updates a task, sets dependencies, and emits `TASK_UPDATED` event.
     * 
     * @param {string|number} id - Task ID.
     * @param {Object} input - Updated task data.
     * @returns {Promise<Object>} Updated task.
     */
    async update(id, input) {
        const task = await TaskRepository.update(id, input);
        await TaskRepository.setDependencies(id, input.prerequisiteTaskIds ?? []);
        emit(EVENTS.TASK_UPDATED, { 
            taskId: id 
        });
        return task;
    },

    /**
     * Deletes a task and emits `TASK_DELETED` event.
     * 
     * @param {string|number} id - Task ID.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await TaskRepository.remove(id);
        emit(EVENTS.TASK_DELETED, { 
            taskId: id 
        });
    },

    /**
     * Reorders tasks by updating `order_index` for each ID in the list.
     * 
     * @param {Array<string|number>} orderedIds - Task IDs in the new order.
     * @returns {Promise<void>}
     */
    reorder: (orderedIds) => TaskRepository.reorder(orderedIds),
};