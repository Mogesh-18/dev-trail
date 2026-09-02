import { useEffect, useState } from "react";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/app/router/router";
import { useAuth } from "@/features/auth/hooks/useAuth";

// Supabase's free tier pauses a project after 7 idle days; the first
// request after that can take 30-60s to wake it back up. If auth is still
// "loading" after a few seconds, swap the message so it doesn't look broken.
const SLOW_LOAD_MESSAGE_DELAY_MS = 4000;

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
            <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center text-muted-foreground">
                <p>Loading…</p>
                {showSlowMessage && (
                    <p className="max-w-xs text-sm">
                        Taking longer than usual — if this workspace has been idle, the
                        database is waking back up. This can take up to a minute.
                    </p>
                )}
            </div>
        );
    }

    return <RouterProvider router={router} context={{ auth: { status, role } }} />;
}