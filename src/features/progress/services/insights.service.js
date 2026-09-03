import { TASK_STATUS, ASSIGNMENT_STATUS } from "@/constants/statuses";

/**
 * Summarises task counts (total, completed, in progress, remaining).
 * 
 * @param {Array} tasks - List of task objects.
 * @param {Array} progressList - List of progress records.
 * @returns {{ total: number, completed: number, inProgress: number, remaining: number }}
 */
export function summarizeCounts(tasks, progressList) {
    const statusOf = (taskId) => progressList.find((p) => p.taskId === taskId)?.status;
    return {
        total: tasks.length,
        completed: tasks.filter((t) => statusOf(t.id) === TASK_STATUS.COMPLETED).length,
        inProgress: tasks.filter((t) => statusOf(t.id) === TASK_STATUS.IN_PROGRESS).length,
        remaining: tasks.filter((t) => {
            const s = statusOf(t.id);
            return s !== TASK_STATUS.COMPLETED && s !== TASK_STATUS.SKIPPED;
        }).length,
    };
}

/**
 * Calculates overall progress percentage (skipped tasks excluded).
 * 
 * @param {Array} tasks - List of task objects.
 * @param {Array} progressList - List of progress records.
 * @returns {number} Percentage (0-100).
 */
export function calculateOverallProgress(tasks, progressList) {
    const eligibleTasks = tasks.filter((t) => {
        const p = progressList.find((pr) => pr.taskId === t.id);
        return p?.status !== TASK_STATUS.SKIPPED;
    });
    if (eligibleTasks.length === 0) return 0;
    const completed = eligibleTasks.filter((t) =>
        progressList.some((p) => p.taskId === t.id && p.status === TASK_STATUS.COMPLETED)
    ).length;
    return Math.round((completed / eligibleTasks.length) * 100);
}

/**
 * Calculates the percentage of assignments marked as completed.
 * 
 * @param {Array} assignments - List of assignment objects.
 * @returns {number} Percentage (0-100).
 */
export function calculateAssignmentCompletionRate(assignments) {
    if (assignments.length === 0) return 0;
    const completed = assignments.filter((a) => a.status === ASSIGNMENT_STATUS.COMPLETED).length;
    return Math.round((completed / assignments.length) * 100);
}

/**
 * Calculates the current daily streak based on task completions and assignment submissions.
 * 
 * @param {Array} activity - List of activity entries.
 * @returns {number} Number of consecutive days with at least one completion/submission.
 */
export function calculateStreak(activity) {
    const completionTypes = new Set(["TASK_COMPLETED", "ASSIGNMENT_SUBMITTED"]);
    const days = new Set(
        activity.filter((a) => completionTypes.has(a.type)).map((a) => new Date(a.createdAt).toDateString())
    );
    if (days.size === 0) return 0;

    let streak = 0;
    const cursor = new Date();
    while (days.has(cursor.toDateString())) {
        streak += 1;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

/**
 * Calculates the average number of completed tasks per day over a rolling window.
 * 
 * @param {Array} activity - List of activity entries.
 * @param {number} [windowDays=14] - Number of days to include.
 * @returns {number} Tasks per day (rounded to one decimal).
 */
export function calculateVelocity(activity, windowDays = 14) {
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    const completedInWindow = activity.filter(
        (a) => a.type === "TASK_COMPLETED" && new Date(a.createdAt).getTime() >= cutoff
    ).length;
    return Math.round((completedInWindow / windowDays) * 10) / 10;
}

/**
 * Finds tasks that have been "in progress" for longer than a threshold.
 * 
 * @param {Array} tasks - List of task objects.
 * @param {Array} progressList - List of progress records.
 * @param {number} [thresholdDays=7] - Days after which a task is considered delayed.
 * @returns {Array} Filtered list of delayed task objects.
 */
export function findDelayedTasks(tasks, progressList, thresholdDays = 7) {
    const now = Date.now();
    return tasks.filter((t) => {
        const p = progressList.find((pr) => pr.taskId === t.id);
        if (p?.status !== TASK_STATUS.IN_PROGRESS || !p.startedAt) return false;
        const daysOpen = (now - new Date(p.startedAt).getTime()) / (24 * 60 * 60 * 1000);
        return daysOpen > thresholdDays;
    });
}