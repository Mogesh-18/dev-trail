import { createRoute } from "@tanstack/react-router";
import { adminLayoutRoute } from "@/app/router/routes/admin/admin.layout";
import AdminDashboardPage from "@/features/dashboard/pages/AdminDashboardPage";
import AdminTasksPage from "@/features/tasks/pages/AdminTasksPage";
import AdminTaskDetailsPage from "@/features/tasks/pages/AdminTaskDetailsPage";
import AdminAssignmentsPage from "@/features/assignments/pages/AdminAssignmentsPage";
import AdminAssignmentDetailsPage from "@/features/assignments/pages/AdminAssignmentDetailsPage";
import AdminProgressPage from "@/features/progress/pages/AdminProgressPage";
import UsersPage from "@/features/users/pages/UsersPage";

export const adminDashboardRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "dashboard",
    component: AdminDashboardPage,
});

export const adminTasksRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "tasks",
    component: AdminTasksPage,
});

export const adminTaskDetailsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "tasks/$taskId",
    component: AdminTaskDetailsPage,
});

export const adminAssignmentsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "assignments",
    component: AdminAssignmentsPage,
});

export const adminAssignmentDetailsRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "assignments/$assignmentId",
    component: AdminAssignmentDetailsPage,
});

export const adminProgressRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "progress",
    component: AdminProgressPage,
});

export const adminUsersRoute = createRoute({
    getParentRoute: () => adminLayoutRoute,
    path: "users",
    component: UsersPage,
});