
/**
 * Task status values.
 * 
 * @type {{ LOCKED: 'locked', AVAILABLE: 'available', IN_PROGRESS: 'in_progress', COMPLETED: 'completed', SKIPPED: 'skipped' }}
 */
export const TASK_STATUS = {
    LOCKED: "locked",
    AVAILABLE: "available",
    IN_PROGRESS: "in_progress",
    COMPLETED: "completed",
    SKIPPED: "skipped",
};

/**
 * Assignment status values.
 * 
 * @type {{ NOT_STARTED: 'not_started', IN_PROGRESS: 'in_progress', SUBMITTED: 'submitted', UNDER_REVIEW: 'under_review', CHANGES_REQUESTED: 'changes_requested', COMPLETED: 'completed' }}
 */
export const ASSIGNMENT_STATUS = {
    NOT_STARTED: "not_started",
    IN_PROGRESS: "in_progress",
    SUBMITTED: "submitted",
    UNDER_REVIEW: "under_review",
    CHANGES_REQUESTED: "changes_requested",
    COMPLETED: "completed",
};

/**
 * Mapping from task/assignment status to Tailwind colour tokens (from `index.css`).
 * Used by `StatusBadge` and dashboard charts.
 * 
 * @type {Record<string, string>}
 */
export const TASK_STATUS_COLOR = {
    [TASK_STATUS.LOCKED]: "status-locked",
    [TASK_STATUS.AVAILABLE]: "status-available",
    [TASK_STATUS.IN_PROGRESS]: "status-progress",
    [TASK_STATUS.COMPLETED]: "status-completed",
    [TASK_STATUS.SKIPPED]: "status-skipped",
};
