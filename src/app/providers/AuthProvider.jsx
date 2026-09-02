import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth.store";

export function AuthProvider({ children }) {
    const setSession = useAuthStore((s) => s.setSession);
    const setRole = useAuthStore((s) => s.setRole);
    const setStatus = useAuthStore((s) => s.setStatus);
    const reset = useAuthStore((s) => s.reset);

    useEffect(() => {
        let active = true;

        async function resolveAuthorization(session) {
            if (!session) {
                if (active) reset();
                return;
            }
            if (active) {
                setSession(session);
                setStatus("loading");
            }
            try {
                const res = await fetch("/api/auth-allowlist-check", {
                    method: "POST",
                    headers: { Authorization: `Bearer ${session.access_token}` },
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

        supabase.auth.getSession().then(({ data }) => resolveAuthorization(data.session));

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            resolveAuthorization(session);
        });

        return () => {
            active = false;
            listener.subscription.unsubscribe();
        };
    }, [setSession, setRole, setStatus, reset]);

    return children;
}