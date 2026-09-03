import { supabase } from "@/lib/supabase";

/**
 * Service for authentication operations (Google sign-in and sign-out).
 * 
 * @type {{
 *   signInWithGoogle: () => Promise<{ data: any, error: any }>,
 *   signOut: () => Promise<{ error: any }>
 * }}
 */
export const AuthService = {

    /**
     * Initiates Google OAuth sign-in, redirecting back to the application origin.
     * 
     * @returns {Promise<{ data: any, error: any }>} The Supabase OAuth response.
     */
    signInWithGoogle: () => supabase.auth.signInWithOAuth({
        provider: "google",
        options: { 
            redirectTo: window.location.origin 
        },
    }),

    /**
     * Signs out the current user.
     * 
     * @returns {Promise<{ error: any }>} The Supabase sign-out response.
     */
    signOut: () => supabase.auth.signOut(),
};