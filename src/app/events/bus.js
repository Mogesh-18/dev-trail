const target = new EventTarget();

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

    PROGRESS_UPDATED: "PROGRESS_UPDATED",
    USER_UPDATED: "USER_UPDATED",

    AUTH_LOGIN: "AUTH_LOGIN",
    AUTH_LOGOUT: "AUTH_LOGOUT",
};

/** Emit an event with an optional detail payload. */
export function emit(type, detail) {
    target.dispatchEvent(new CustomEvent(type, { detail }));
}

/** Subscribe to an event. Returns an unsubscribe function — call it in a useEffect cleanup. */
export function on(type, handler) {
    const listener = (event) => handler(event.detail);
    target.addEventListener(type, listener);
    return () => target.removeEventListener(type, listener);
}
