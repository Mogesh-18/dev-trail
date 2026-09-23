import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

/**
 * Wraps `fetch` with a retry mechanism on network errors.
 *
 * @param {RequestInfo} input
 * @param {RequestInit} [init]
 * @param {number} [retries=1]
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(input, init, retries = 1) {
    try {
        return await fetch(input, init);
    } catch (err) {
        if (retries > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return fetchWithRetry(input, init, retries - 1);
        }
        throw err;
    }
}

/**
 * Auth events that represent an actual sign-in/out transition and
 * should show the full loading screen while resolving. Supabase also
 * fires onAuthStateChange for TOKEN_REFRESHED (automatic, happens when
 * a tab regains focus and the client silently refreshes the session)
 * and for USER_UPDATED — neither of these means the user's identity or
 * authorization changed, so neither should trigger a loading screen.
 * This was the cause of "loader shows every time I switch tabs": every
 * TOKEN_REFRESHED event was setting status back to "loading" and
 * re-running the allowlist check, even though nothing meaningful had
 * happened.
 */
const LOADING_EVENTS = new Set([
    "SIGNED_IN", 
    "SIGNED_OUT", 
    "INITIAL_SESSION"
]);

/**
 * React context provider that initialises and listens to Supabase
 * authentication. On a genuine sign-in/out, it calls
 * `/api/auth-allowlist-check` and shows loading while resolving. A
 * background token refresh updates the session silently without
 * touching status, so it's invisible to the user.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export function AuthProvider({ children }) {
    const setSession = useAuthStore((s) => s.setSession);
    const setRole = useAuthStore((s) => s.setRole);
    const setStatus = useAuthStore((s) => s.setStatus);
    const reset = useAuthStore((s) => s.reset);

    useEffect(() => {
        let active = true;

        async function resolveAuthorization(session, { showLoading } = { showLoading: true }) {
            if (!session) {
                if (active) reset();
                return;
            }
            if (active) {
                setSession(session);
                if (showLoading) setStatus("loading");
            }
            try {
                const res = await fetchWithRetry("/api/auth-allowlist-check", {
                    method: "POST",
                    headers: { 
                        Authorization: `Bearer ${session.access_token}` 
                    },
                });
                if (!res.ok) {
                    await supabase.auth.signOut();
                    if (active) setStatus("unauthorized");
                    return;
                }
                const { role } = await res.json();
                if (active) {
                    setRole(role);
                    setStatus("authenticated");
                }
            } catch {
                await supabase.auth.signOut();
                if (active) setStatus("unauthorized");
            }
        }

        supabase.auth.getSession().then(({ data }) => resolveAuthorization(data.session, { showLoading: true }));

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            // Only a real sign-in/out (or the initial resolution) shows
            // the loading screen. TOKEN_REFRESHED — fired automatically
            // on tab focus — updates the session in the background so a
            // long-lived tab doesn't silently go stale, without ever
            // flashing a loader for something the user didn't do.
            resolveAuthorization(session, { 
                showLoading: LOADING_EVENTS.has(event) 
            });
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, [setSession, setRole, setStatus, reset]);

    return children;
}