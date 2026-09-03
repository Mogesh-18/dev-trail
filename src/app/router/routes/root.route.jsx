import { createRootRoute, Outlet } from "@tanstack/react-router";

/**
 * Root route with an `<Outlet />` — the top‑level wrapper for all routes.
 * 
 * @type {Route}
 */
export const rootRoute = createRootRoute({
    component: () => <Outlet />,
});