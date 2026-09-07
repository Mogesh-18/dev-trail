import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import { requireRole } from "@/app/router/guards";
import { ROLES } from "@/constants/roles";
import { AppShell } from "@/components/layout/AppShell";

/**
 * Layout route for all admin pages, requiring `ADMIN` role.
 * Renders the `AppShell` wrapper.
 * 
 * @type {Route}
 */
export const adminLayoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    // id: "admin-layout",
    path: "/admin",
    beforeLoad: requireRole(ROLES.ADMIN),
    component: AppShell,
});