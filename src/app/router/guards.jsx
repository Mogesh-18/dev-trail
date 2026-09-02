import { redirect } from "@tanstack/react-router";
import { ROLES } from "@/constants/roles";
import { ROUTES } from "@/constants/routes";

/**
 * The single place role-gating logic lives — layout routes call this in
 * beforeLoad rather than each page re-checking auth.status/role itself.
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