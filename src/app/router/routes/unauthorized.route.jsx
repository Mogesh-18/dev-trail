import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import UnauthorizedPage from "@/features/auth/pages/UnauthorizedPage";

/**
 * Unauthorized route (`/unauthorized`) — displayed when a user lacks permissions.
 * 
 * @type {Route}
 */
export const unauthorizedRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/unauthorized",
    component: UnauthorizedPage,
});