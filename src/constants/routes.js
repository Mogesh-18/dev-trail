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