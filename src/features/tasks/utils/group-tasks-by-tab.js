import { deriveTaskStatuses } from "@/features/tasks/services/task-availability.service";
import { TASK_STATUS } from "@/constants/statuses";

/**
 * Groups tasks into three tabs for the student view: "In Progress", "Completed", and "Upcoming".
 * Adds a `derivedStatus` property to each task.
 * 
 * @param {Array} tasks - List of tasks.
 * @param {Array} dependencies - All dependency rows.
 * @param {Array} progressList - List of progress records (for the current student).
 * @returns {{
 *   inProgress: Array,
 *   completed: Array,
 *   upcoming: Array
 * }}
 */
export function groupTasksByTab(tasks, dependencies, progressList) {
    const progressByTaskId = Object.fromEntries(progressList.map((p) => [p.taskId, p]));
    const statuses = deriveTaskStatuses(tasks, dependencies, progressByTaskId);
    const withStatus = tasks.map((t) => ({ ...t, derivedStatus: statuses[t.id] }));

    return {
        inProgress: withStatus.filter((t) => t.derivedStatus === TASK_STATUS.IN_PROGRESS),
        completed: withStatus.filter((t) => t.derivedStatus === TASK_STATUS.COMPLETED),
        upcoming: withStatus.filter(
            (t) => t.derivedStatus === TASK_STATUS.AVAILABLE || t.derivedStatus === TASK_STATUS.LOCKED
        ),
    };
}