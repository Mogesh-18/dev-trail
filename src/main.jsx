import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryProvider } from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import { AuthProvider } from "@/app/providers/AuthProvider";
import { EventListenersProvider } from "@/app/providers/EventListenersProvider";
import { RouterRoot } from "@/app/router/RouterRoot";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <QueryProvider>
            <ThemeProvider>
                <AuthProvider>
                    <EventListenersProvider>
                        <RouterRoot />
                    </EventListenersProvider>
                </AuthProvider>
            </ThemeProvider>
        </QueryProvider>
    </StrictMode>
);