import { createRoute, redirect } from "@tanstack/react-router";
import { rootRoute } from "@/app/router/routes/root.route";
import LoginPage from "@/features/auth/pages/LoginPage";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Login route (`/login`). If already authenticated, redirects to dashboard.
 * 
 * @type {Route}
 */
export const loginRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/login",
    beforeLoad: ({ context }) => {
        const { auth } = context;
        if (auth.status === "authenticated") {
            throw redirect({
                to: auth.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD,
            });
        }
    },
    component: LoginPage,
});