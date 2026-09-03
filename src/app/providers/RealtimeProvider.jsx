import { createContext, useContext, useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

/**
 * React context providing the Realtime connection status.
 * 
 * @type {React.Context<{ connected: boolean }>}
 */
const RealtimeContext = createContext({
    connected: false
});

/**
 * Provider that sets up a Supabase Realtime channel for tasks, progress, and assignments.
 * Invalidates the corresponding TanStack Query keys on any change.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function RealtimeProvider({ children }) {
    const queryClient = useQueryClient();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const channel = supabase
            .channel("devtrail-sync")
            .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, () => {
                queryClient.invalidateQueries({ 
                    queryKey: ["tasks"] 
                });
            })
            .on("postgres_changes", { event: "*", schema: "public", table: "task_dependencies" }, () => {
                queryClient.invalidateQueries({ 
                    queryKey: ["task-dependencies"] 
                });
            })
            .on("postgres_changes", { event: "*", schema: "public", table: "progress" }, () => {
                queryClient.invalidateQueries({ 
                    queryKey: ["progress"] 
                });
            })
            .on("postgres_changes", { event: "*", schema: "public", table: "assignments" }, () => {
                queryClient.invalidateQueries({ 
                    queryKey: ["assignments"] 
                });
            })
            .subscribe((status) => setConnected(status === "SUBSCRIBED"));

        return () => {
            supabase.removeChannel(channel);
        };
    }, [queryClient]);

    return <RealtimeContext.Provider value={{ connected }}>{children}</RealtimeContext.Provider>;
}

/**
 * Hook that returns the current Realtime connection status.
 * 
 * @returns {{ connected: boolean }}
 */
export function useRealtimeStatus() {
    return useContext(RealtimeContext);
}