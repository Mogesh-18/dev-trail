import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import { requireRole } from "@/app/router/guards";
import { ROLES } from "@/constants/roles";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Layout route for all student pages, requiring `STUDENT` role.
 * Renders the `AppShell` wrapper.
 * 
 * @type {Route}
 */
export const studentLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    // id: "student-layout",
    path: "/student",
    beforeLoad: requireRole(ROLES.STUDENT),
    component: AppShell,
});