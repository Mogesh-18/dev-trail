import { redirect } from "@tanstack/react-router";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * Returns a `beforeLoad` guard that enforces a specific role.
 * On failure, redirects to `/unauthorized`, `/login`, or the correct dashboard.
 * 
 * @param {string} role - Required role (e.g. `ROLES.ADMIN`).
 * @returns {Function} A `beforeLoad` function for TanStack Router.
 */
export function requireRole(role) {
    return function beforeLoad({ context }) {
        const { auth } = context;

        if (auth.status === "unauthorized") {
            throw redirect({ to: ROUTES.UNAUTHORIZED });
        }
        if (auth.status !== "authenticated") {
            throw redirect({ to: ROUTES.LOGIN });
        }
        if (auth.role !== role) {
            throw redirect({
                to: auth.role === ROLES.ADMIN ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD,
            });
        }
    };
}