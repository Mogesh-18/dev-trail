import { supabase } from "@/lib/supabase";

export const AuthService = {
    signInWithGoogle: () =>
        supabase.auth.signInWithOAuth({
            provider: "google",
            options: { 
                redirectTo: window.location.origin 
            },
        }),
    signOut: () => supabase.auth.signOut(),
};