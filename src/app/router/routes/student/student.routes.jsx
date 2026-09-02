import { createRoute } from "@tanstack/react-router";
import { studentLayoutRoute } from "@/app/router/routes/student/student.layout";
import StudentDashboardPage from "@/features/dashboard/pages/StudentDashboardPage";
import StudentTasksPage from "@/features/tasks/pages/StudentTasksPage";
import StudentTaskDetailsPage from "@/features/tasks/pages/StudentTaskDetailsPage";
import StudentAssignmentsPage from "@/features/assignments/pages/StudentAssignmentsPage";
import StudentAssignmentDetailsPage from "@/features/assignments/pages/StudentAssignmentDetailsPage";
import AccountPage from "@/features/account/pages/AccountPage";

export const studentDashboardRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "dashboard",
    component: StudentDashboardPage,
});

export const studentTasksRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "tasks",
    component: StudentTasksPage,
});

export const studentTaskDetailsRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "tasks/$taskId",
    component: StudentTaskDetailsPage,
});

export const studentAssignmentsRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "assignments",
    component: StudentAssignmentsPage,
});

export const studentAssignmentDetailsRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "assignments/$assignmentId",
    component: StudentAssignmentDetailsPage,
});

export const studentAccountRoute = createRoute({
    getParentRoute: () => studentLayoutRoute,
    path: "account",
    component: AccountPage,
});