import { TASK_STATUS } from "@/constants/statuses";

/**
 * Titles of linked tasks that aren't completed yet — used both to
 * decide whether an assignment can be started and to explain why not.
 *
 * @param {string|number} assignmentId
 * @param {Array<{assignmentId, taskId}>} taskLinks
 * @param {Array} tasks
 * @param {Record<string, {status: string}>} progressByTaskId
 * @returns {string[]}
 */
export function getIncompleteLinkedTaskTitles(assignmentId, taskLinks, tasks, progressByTaskId) {
    return taskLinks
        .filter((l) => l.assignmentId === assignmentId)
        .map((l) => tasks.find((t) => t.id === l.taskId))
        .filter(Boolean)
        .filter((t) => progressByTaskId[t.id]?.status !== TASK_STATUS.COMPLETED)
        .map((t) => t.title);
}

/**
 * An assignment with no linked tasks is always startable (nothing to
 * gate on). Otherwise, every linked task must be completed first.
 *
 * @returns {boolean}
 */
export function canStartAssignment(assignmentId, taskLinks, tasks, progressByTaskId) {
    return getIncompleteLinkedTaskTitles(assignmentId, taskLinks, tasks, progressByTaskId).length === 0;
}