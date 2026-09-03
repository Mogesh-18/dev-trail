import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/features/auth/services/auth.service";

/**
 * Custom hook providing authentication state and actions (sign in/out).
 * Uses the auth store and AuthService.
 * 
 * @returns {{
 *   status: 'loading'|'authenticated'|'unauthenticated'|'unauthorized',
 *   session: import('@supabase/supabase-js').Session|null,
 *   role: string|null,
 *   user: import('@supabase/supabase-js').User|null,
 *   isAuthenticated: boolean,
 *   signInWithGoogle: () => Promise<void>,
 *   signOut: () => Promise<void>
 * }}
 */
export function useAuth() {
    const status = useAuthStore((s) => s.status);
    const session = useAuthStore((s) => s.session);
    const role = useAuthStore((s) => s.role);

    return {
        status,
        session,
        role,
        user: session?.user ?? null,
        isAuthenticated: status === "authenticated",
        signInWithGoogle: AuthService.signInWithGoogle,
        signOut: AuthService.signOut,
    };
}