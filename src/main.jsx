import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { EventListenersProvider } from "@/app/providers/EventListenersProvider";
import { RouterRoot } from "@/app/router/RouterRoot";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { registerServiceWorker } from "@/lib/register-service-worker";
import "./index.css";

registerServiceWorker();

/**
 * App entry point. RealtimeProvider is removed entirely — no realtime
 * tracking of any kind (data sync or presence) runs anywhere in the
 * app now. EventListenersProvider stays: it's activity logging + push
 * notifications, unrelated to Realtime.
 *
 * @returns {void}
 */
createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ErrorBoundary>
            <QueryProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <EventListenersProvider>
                            <RouterRoot />
                        </EventListenersProvider>
                    </AuthProvider>
                </ThemeProvider>
            </QueryProvider>
        </ErrorBoundary>
    </StrictMode>
);