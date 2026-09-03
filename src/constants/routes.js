
/**
 * Route paths for the entire application.
 * Some are functions to generate dynamic paths with IDs.
 * 
 * @type {{
 *   LOGIN: string,
 *   UNAUTHORIZED: string,
 *   ADMIN_DASHBOARD: string,
 *   ADMIN_TASKS: string,
 *   ADMIN_TASK_DETAILS: (taskId: string|number) => string,
 *   ADMIN_ASSIGNMENTS: string,
 *   ADMIN_ASSIGNMENT_DETAILS: (assignmentId: string|number) => string,
 *   ADMIN_PROGRESS: string,
 *   ADMIN_USERS: string,
 *   ADMIN_NOTES: string,
 *   STUDENT_DASHBOARD: string,
 *   STUDENT_TASKS: string,
 *   STUDENT_TASK_DETAILS: (taskId: string|number) => string,
 *   STUDENT_ASSIGNMENTS: string,
 *   STUDENT_ASSIGNMENT_DETAILS: (assignmentId: string|number) => string,
 *   STUDENT_ACCOUNT: string,
 * }}
 */
export const ROUTES = {
    LOGIN: "/login",
    UNAUTHORIZED: "/unauthorized",

    ADMIN_DASHBOARD: "/admin/dashboard",
    ADMIN_TASKS: "/admin/tasks",
    ADMIN_TASK_DETAILS: (taskId) => `/admin/tasks/${taskId}`,
    ADMIN_ASSIGNMENTS: "/admin/assignments",
    ADMIN_ASSIGNMENT_DETAILS: (assignmentId) => `/admin/assignments/${assignmentId}`,
    ADMIN_PROGRESS: "/admin/progress",
    ADMIN_USERS: "/admin/users",
    ADMIN_NOTES: "/admin/notes",

    STUDENT_DASHBOARD: "/student/dashboard",
    STUDENT_TASKS: "/student/tasks",
    STUDENT_TASK_DETAILS: (taskId) => `/student/tasks/${taskId}`,
    STUDENT_ASSIGNMENTS: "/student/assignments",
    STUDENT_ASSIGNMENT_DETAILS: (assignmentId) => `/student/assignments/${assignmentId}`,
    STUDENT_ACCOUNT: "/student/account",
};