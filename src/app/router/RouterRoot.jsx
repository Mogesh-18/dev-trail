import { useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router/router";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { PageLoader } from "@/components/common/PageLoader";

/**
 * Supabase's free tier pauses a project after 7 idle days; the first
 * request after that can take 30-60s to wake it back up. If auth is still
 * "loading" after a few seconds, swap the message so it doesn't look broken.
 */
const SLOW_LOAD_MESSAGE_DELAY_MS = 4000;

/**
 * Root component that provides the router with auth context. Shows the
 * branded PageLoader while auth is resolving, with a slow-load message
 * after 4s (Supabase cold-start).
 *
 * This is the one screen in the app that renders outside AppShell's
 * overflow-x-hidden wrapper — it's the very first paint on every fresh
 * load, so it gets its own explicit `w-full overflow-x-hidden` rather
 * than relying only on the global html/body/#root rule in index.css.
 *
 * @returns {JSX.Element}
 */
export function RouterRoot() {
    const { status, role } = useAuth();
    const [showSlowMessage, setShowSlowMessage] = useState(false);

    useEffect(() => {
        if (status !== "loading") {
            setShowSlowMessage(false);
            return undefined;
        }
        const timer = setTimeout(() => setShowSlowMessage(true), SLOW_LOAD_MESSAGE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [status]);

    if (status === "loading") {
        return (
            <div className="w-full overflow-x-hidden">
                <PageLoader
                    label={showSlowMessage ? "Waking things up…" : "Loading DevTrail…"}
                    detail={
                        showSlowMessage
                            ? "Taking longer than usual — if this workspace has been idle, the database is waking back up. This can take up to a minute."
                            : undefined
                    }
                />
            </div>
        );
    }

    return <RouterProvider router={router} context={{ auth: { status, role } }} />;
}