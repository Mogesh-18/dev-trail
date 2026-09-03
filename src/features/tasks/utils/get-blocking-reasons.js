
/**
 * Returns titles of prerequisites that are not yet completed for a given task.
 * Used to show why a task is locked.
 * 
 * @param {Object} task - The task object.
 * @param {Array<{ taskId: string, prerequisiteTaskId: string }>} dependencies - All dependency rows.
 * @param {Array<Object>} allTasks - Full list of tasks.
 * @param {Record<string, { status: string }>} progressByTaskId - Progress keyed by task ID.
 * @returns {string[]} Titles of incomplete prerequisites.
 */
export function getBlockingReasons(task, dependencies, allTasks, progressByTaskId) {
    return dependencies
        .filter((d) => d.taskId === task.id)
        .map((d) => ({ 
            id: d.prerequisiteTaskId, 
            title: allTasks.find((t) => t.id === d.prerequisiteTaskId)?.title 
        }))
        .filter((p) => p.title && progressByTaskId[p.id]?.status !== "completed")
        .map((p) => p.title);
}