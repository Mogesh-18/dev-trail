import { createRoute } from "@tanstack/react-router";
import { adminLayoutRoute } from "@/app/router/routes/admin/admin.layout";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";
import AdminTasksPage from "@/features/tasks/pages/AdminTasksPage";
import AdminTaskDetailsPage from "@/features/tasks/pages/AdminTaskDetailsPage";
import AdminAssignmentsPage from "@/features/assignments/pages/AdminAssignmentsPage";
import AdminAssignmentDetailsPage from "@/features/assignments/pages/AdminAssignmentDetailsPage";
import AdminProgressPage from "@/features/progress/pages/AdminProgressPage";
import AdminNotesPage from "@/features/notes/pages/AdminNotesPage";
import AdminTimelinePage from "@/features/progress/pages/AdminTimelinePage";
import UsersPage from "@/features/users/pages/UsersPage";

/**
 * Admin dashboard route.
 * 
 * @type {Route}
 */
export const adminDashboardRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "dashboard",
    component: AdminDashboardPage,
});

/**
 * Admin tasks list route.
 * 
 * @type {Route}
 */
export const adminTasksRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "tasks",
    component: AdminTasksPage,
});

/**
 * Admin task details route with `taskId` param.
 * 
 * @type {Route}
 */
export const adminTaskDetailsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "tasks/$taskId",
    component: AdminTaskDetailsPage,
});

/**
 * Admin assignments list route.
 * 
 * @type {Route}
 */
export const adminAssignmentsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "assignments",
    component: AdminAssignmentsPage,
});

/**
 * Admin assignment details route with `assignmentId` param.
 * 
 * @type {Route}
 */
export const adminAssignmentDetailsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "assignments/$assignmentId",
    component: AdminAssignmentDetailsPage,
});

/**
 * Admin progress overview route.
 * 
 * @type {Route}
 */
export const adminProgressRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "progress",
    component: AdminProgressPage,
});

/**
 * Admin notes management route.
 * 
 * @type {Route}
 */
export const adminNotesRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "notes",
    component: AdminNotesPage,
});

/**
 * Admin users management route.
 * 
 * @type {Route}
 */
export const adminUsersRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "users",
    component: UsersPage,
});

/**
 * TanStack Router route definition for the admin timeline page.
 * 
 * @type {Route}
 */
export const adminTimelineRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "timeline",
    component: AdminTimelinePage,
});