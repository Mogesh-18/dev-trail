import { TASK_STATUS } from "@/constants/statuses";

/**
 * Determines the actual status of a single task for a given student.
 * Uses stored progress (if any) for in-progress/completed/skipped; otherwise
 * computes locked/available based on prerequisite completion.
 * 
 * @param {Object} task - Task object (must have `id`).
 * @param {Array<{ taskId: string, prerequisiteTaskId: string }>} dependencies - All dependency rows.
 * @param {Record<string, { status: string }>} progressByTaskId - Progress records keyed by task ID.
 * @returns {string} One of TASK_STATUS constants.
 */
export function deriveTaskStatus(task, dependencies, progressByTaskId = {}) {
    const own = progressByTaskId[task.id];
    if (own?.status === TASK_STATUS.IN_PROGRESS) return TASK_STATUS.IN_PROGRESS;
    if (own?.status === TASK_STATUS.COMPLETED) return TASK_STATUS.COMPLETED;
    if (own?.status === TASK_STATUS.SKIPPED) return TASK_STATUS.SKIPPED;

    const prerequisites = dependencies.filter((dep) => dep.taskId === task.id).map((dep) => dep.prerequisiteTaskId);
    const allPrerequisitesMet = prerequisites.every(
        (prereqId) => progressByTaskId[prereqId]?.status === TASK_STATUS.COMPLETED
    );

    return allPrerequisitesMet ? TASK_STATUS.AVAILABLE : TASK_STATUS.LOCKED;
}

/**
 * Convenience function to derive statuses for an entire task list at once.
 * 
 * @param {Array} tasks - List of task objects.
 * @param {Array} dependencies - All dependency rows.
 * @param {Record<string, { status: string }>} progressByTaskId - Progress records keyed by task ID.
 * @returns {Record<string, string>} Map of task ID → derived status.
 */
export function deriveTaskStatuses(tasks, dependencies, progressByTaskId = {}) {
    return Object.fromEntries(
        tasks.map((task) => [task.id, deriveTaskStatus(task, dependencies, progressByTaskId)])
    );
}