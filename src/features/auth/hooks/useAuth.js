import { useAuthStore } from "@/stores/auth.store";
import { AuthService } from "@/features/auth/services/auth.service";

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