import { TASK_STATUS, ASSIGNMENT_STATUS } from "@/constants/statuses";

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

export function calculateAssignmentCompletionRate(assignments) {
    if (assignments.length === 0) return 0;
    const completed = assignments.filter((a) => a.status === ASSIGNMENT_STATUS.COMPLETED).length;
    return Math.round((completed / assignments.length) * 100);
}

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

export function calculateVelocity(activity, windowDays = 14) {
    const cutoff = Date.now() - windowDays * 24 * 60 * 60 * 1000;
    const completedInWindow = activity.filter(
        (a) => a.type === "TASK_COMPLETED" && new Date(a.createdAt).getTime() >= cutoff
    ).length;
    return Math.round((completedInWindow / windowDays) * 10) / 10;
}

export function findDelayedTasks(tasks, progressList, thresholdDays = 7) {
    const now = Date.now();
    return tasks.filter((t) => {
        const p = progressList.find((pr) => pr.taskId === t.id);
        if (p?.status !== TASK_STATUS.IN_PROGRESS || !p.startedAt) return false;
        const daysOpen = (now - new Date(p.startedAt).getTime()) / (24 * 60 * 60 * 1000);
        return daysOpen > thresholdDays;
    });
}