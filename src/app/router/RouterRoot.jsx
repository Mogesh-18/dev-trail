import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router/router";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Auth resolves asynchronously (Supabase getSession + allowlist check), so
// the router only mounts once we know status/role — beforeLoad guards can
// then read a settled context.auth instead of racing the initial load.
export function RouterRoot() {
    const { status, role } = useAuth();

    if (status === "loading") {
        return (
            <div className="flex min-h-screen items-center justify-center text-muted-foreground">
                Loading…
            </div>
        );
    }

    return <RouterProvider router={router} context={{ auth: { status, role } }} />;
}