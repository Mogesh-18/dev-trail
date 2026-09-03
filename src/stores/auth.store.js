import { create } from "zustand";

/**
 * Zustand store for authentication state.
 * 
 * @typedef {Object} AuthStore
 * @property {'loading'|'authenticated'|'unauthenticated'|'unauthorized'} status - Current auth status.
 * @property {import('@supabase/supabase-js').Session|null} session - The current session object.
 * @property {string|null} role - User role ('admin' or 'student').
 * @property {(session: import('@supabase/supabase-js').Session) => void} setSession
 * @property {(role: string) => void} setRole
 * @property {(status: AuthStore['status']) => void} setStatus
 * @property {() => void} reset - Resets to unauthenticated with null session and role.
 * @returns {AuthStore}
 */
export const useAuthStore = create((set) => ({
    status: "loading", // 'loading' | 'authenticated' | 'unauthenticated' | 'unauthorized'
    session: null,
    role: null,
    setSession: (session) => set({ 
        session 
    }),
    setRole: (role) => set({ 
        role 
    }),
    setStatus: (status) => set({ 
        status 
    }),
    reset: () => set({ 
        status: "unauthenticated", 
        session: null, 
        role: null 
    }),
}));