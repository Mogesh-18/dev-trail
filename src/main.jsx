import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { EventListenersProvider } from "@/app/providers/EventListenersProvider";
import { RouterRoot } from "@/app/router/RouterRoot";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import "./index.css";

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