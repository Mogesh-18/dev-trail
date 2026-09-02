import { TASK_STATUS } from "@/constants/statuses";

/**
 * The single source of truth for whether a task is locked, available, in
 * progress, completed, or skipped for a given student. Locked/available are
 * always derived here — never stored — so they can't drift when
 * dependencies change. In-progress/completed/skipped come from a stored
 * Progress row (added in Milestone 6); this function is written now so
 * Milestones 6 and 7 both consume the exact same rule, but it has no caller
 * yet in this milestone — the admin task list doesn't need per-student
 * status.
 *
 * @param {{id: string}} task
 * @param {{taskId: string, prerequisiteTaskId: string}[]} dependencies - all dependency rows
 * @param {Record<string, {status: string}>} progressByTaskId - this student's progress, keyed by taskId
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

/** Convenience for a whole task list at once — used by both admin and student task views. */
export function deriveTaskStatuses(tasks, dependencies, progressByTaskId = {}) {
    return Object.fromEntries(
        tasks.map((task) => [task.id, deriveTaskStatus(task, dependencies, progressByTaskId)])
    );
}