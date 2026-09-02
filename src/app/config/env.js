// Only VITE_-prefixed vars are ever readable here — anything without that
// prefix (e.g. a Supabase service-role key) simply isn't bundled by Vite,
// which is the enforcement mechanism for "no secrets in client code."
export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
