import { createRouter } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import { indexRoute } from "@/app/router/routes/index.route";
import { loginRoute } from "@/app/router/routes/login.route";
import { unauthorizedRoute } from "@/app/router/routes/unauthorized.route";
import { adminLayoutRoute } from "@/app/router/routes/admin/admin.layout";
import {
    adminDashboardRoute,
    adminTasksRoute,
    adminTaskDetailsRoute,
    adminAssignmentsRoute,
    adminAssignmentDetailsRoute,
    adminProgressRoute,
    adminNotesRoute,
    adminUsersRoute,
} from "@/app/router/routes/admin/admin.routes";
import { studentLayoutRoute } from "@/app/router/routes/student/student.layout";
import {
    studentDashboardRoute,
    studentTasksRoute,
    studentTaskDetailsRoute,
    studentAssignmentsRoute,
    studentAssignmentDetailsRoute,
    studentAccountRoute,
} from "@/app/router/routes/student/student.routes";
import NotFoundPage from "@/components/common/NotFoundPage";
import RouteErrorPage from "@/components/common/RouteErrorPage";

const routeTree = rootRoute.addChildren([
    indexRoute,
    loginRoute,
    unauthorizedRoute,
    adminLayoutRoute.addChildren([
        adminDashboardRoute,
        adminTasksRoute,
        adminTaskDetailsRoute,
        adminAssignmentsRoute,
        adminAssignmentDetailsRoute,
        adminProgressRoute,
        adminNotesRoute,
        adminUsersRoute,
    ]),
    studentLayoutRoute.addChildren([
        studentDashboardRoute,
        studentTasksRoute,
        studentTaskDetailsRoute,
        studentAssignmentsRoute,
        studentAssignmentDetailsRoute,
        studentAccountRoute,
    ]),
]);

export const router = createRouter({
    routeTree,
    context: { auth: undefined },
    defaultNotFoundComponent: NotFoundPage,
    defaultErrorComponent: RouteErrorPage,
});