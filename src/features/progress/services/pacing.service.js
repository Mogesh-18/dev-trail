
/**
 * Number of milliseconds in one day.
 * 
 * @type {number}
 */
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns a new Date set to the start of the week (Sunday) at midnight.
 * 
 * @param {Date|string} date - The reference date.
 * @returns {Date} The start of that week.
 */
function startOfWeek(date) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
}

/**
 * Buckets assignments with a deadline into Overdue / This week / Next week / Later.
 * 
 * @param {Array} assignments - List of assignment objects (must have `deadline` and `status`).
 * @returns {{ overdue: Array, thisWeek: Array, nextWeek: Array, later: Array }}
 */
export function groupAssignmentsByWeek(assignments) {
    const now = new Date();
    const thisWeekStart = startOfWeek(now);
    const nextWeekStart = new Date(thisWeekStart.getTime() + 7 * DAY_MS);
    const weekAfterStart = new Date(thisWeekStart.getTime() + 14 * DAY_MS);

    const buckets = { overdue: [], thisWeek: [], nextWeek: [], later: [] };

    for (const a of assignments) {
        if (!a.deadline || a.status === "completed") continue;
        const deadline = new Date(a.deadline);
        if (deadline < now) buckets.overdue.push(a);
        else if (deadline < nextWeekStart) buckets.thisWeek.push(a);
        else if (deadline < weekAfterStart) buckets.nextWeek.push(a);
        else buckets.later.push(a);
    }

    return buckets;
}

/**
 * Projects a rough completion date for the remaining tasks based on velocity.
 * 
 * @param {number} remainingTaskCount - Number of tasks left.
 * @param {number} velocity - Tasks completed per day (from recent activity).
 * @returns {{ daysRemaining: number, projectedDate: Date } | null}
 */
export function estimateCompletion(remainingTaskCount, velocity) {
    if (!velocity || velocity <= 0 || remainingTaskCount === 0) return null;
    const daysRemaining = Math.ceil(remainingTaskCount / velocity);
    const projectedDate = new Date(Date.now() + daysRemaining * DAY_MS);

    return {
        daysRemaining,
        projectedDate
    };
}