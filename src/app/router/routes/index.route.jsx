import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Root index route (`/`) — redirects based on auth status.
 * If authenticated, goes to dashboard of the user's role.
 * If unauthorized or unauthenticated, redirects to `/unauthorized` or `/login`.
 * 
 * @type {Route}
 */
export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/",
    beforeLoad: ({ context }) => {
        const { auth } = context;
        if (auth.status === "authenticated") {
            throw redirect({
                to: auth.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD,
            });
        }
        if (auth.status === "unauthorized") {
            throw redirect({ 
                to: ROUTES.UNAUTHORIZED 
            });
        }
        throw redirect({ 
            to: ROUTES.LOGIN 
        });
    },
});