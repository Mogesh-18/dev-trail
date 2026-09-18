import { createContext, useContext } from "react";

/**
 * React context providing the Realtime connection status.
 * 
 * @type {React.Context<{ connected: boolean }>}
 */
const RealtimeContext = createContext({
    connected: false
});

/**
 * Realtime is disabled per explicit request — the live-invalidation
 * behavior was causing distracting refetches. Context shape is kept
 * identical (`{ connected: boolean }`) so every existing caller
 * (Sidebar, Header, etc.) keeps working without changes; `connected`
 * is now always `false`, and nothing subscribes to Supabase Realtime.
 *
 * To re-enable later: restore the postgres_changes subscription logic
 * that lived here before (channel + queryClient.invalidateQueries per
 * table), and flip this back to a real Provider component with state.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {JSX.Element}
 */
export function RealtimeProvider({ children }) {
    return <RealtimeContext.Provider value={{ connected: false }}>{children}</RealtimeContext.Provider>;
}

/**
 * Hook that returns the current Realtime connection status.
 * 
 * @returns {{ connected: boolean }}
 */
export function useRealtimeStatus() {
    return useContext(RealtimeContext);
}