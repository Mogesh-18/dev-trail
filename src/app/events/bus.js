
/**
 * Internal event target used as the global event bus.
 * 
 * @type {EventTarget}
 */
const target = new EventTarget();

/**
 * Event names used across the application for the event bus.
 * 
 * @enum {string}
 */
export const EVENTS = {
    TASK_CREATED: "TASK_CREATED",
    TASK_UPDATED: "TASK_UPDATED",
    TASK_DELETED: "TASK_DELETED",
    TASK_STARTED: "TASK_STARTED",
    TASK_COMPLETED: "TASK_COMPLETED",

    ASSIGNMENT_CREATED: "ASSIGNMENT_CREATED",
    ASSIGNMENT_UPDATED: "ASSIGNMENT_UPDATED",
    ASSIGNMENT_SUBMITTED: "ASSIGNMENT_SUBMITTED",
    ASSIGNMENT_COMPLETED: "ASSIGNMENT_COMPLETED",
    ASSIGNMENT_CHANGES_REQUESTED: "ASSIGNMENT_CHANGES_REQUESTED",

    REPORT_SUBMITTED: "REPORT_SUBMITTED",

    PROGRESS_UPDATED: "PROGRESS_UPDATED",
    USER_UPDATED: "USER_UPDATED",

    AUTH_LOGIN: "AUTH_LOGIN",
    AUTH_LOGOUT: "AUTH_LOGOUT",
};

/**
 * Emit a global event with an optional detail payload.
 * 
 * @param {string} type - Event name (one of `EVENTS`).
 * @param {any} [detail] - Data to pass to event listeners.
 */
export function emit(type, detail) {
    target.dispatchEvent(new CustomEvent(type, { detail }));
}

/**
 * Subscribe to a global event. Returns an unsubscribe function.
 * 
 * @param {string} type - Event name (one of `EVENTS`).
 * @param {(detail: any) => void} handler - Callback receiving the event payload.
 * @returns {() => void} Unsubscribe function – call in `useEffect` cleanup.
 */
export function on(type, handler) {
    const listener = (event) => handler(event.detail);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
}
