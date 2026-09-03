import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { EventListenersProvider } from "@/app/providers/EventListenersProvider";
import { RouterRoot } from "@/app/router/RouterRoot";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "./index.css";

/**
 * The application entry point.
 * Wraps the entire app in error boundary, query client, theme, auth, and event listeners providers.
 * Renders the `RouterRoot` component into the DOM element with id `"root"`.
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