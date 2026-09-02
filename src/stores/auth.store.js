import { create } from "zustand";

export const useAuthStore = create((set) => ({
    status: "loading", // 'loading' | 'authenticated' | 'unauthenticated' | 'unauthorized'
    session: null,
    role: null,
    setSession: (session) => set({ session }),
    setRole: (role) => set({ role }),
    setStatus: (status) => set({ status }),
    reset: () => set({ 
        status: "unauthenticated", 
        session: null, 
        role: null 
    }),
}));