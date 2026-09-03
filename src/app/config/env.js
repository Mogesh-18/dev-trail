
/**
 * Environment variables available in the client.
 * Only `VITE_`‑prefixed variables are bundled; this prevents exposing secrets.
 * 
 * @type {{ supabaseUrl: string, supabaseAnonKey: string }}
 */
export const env = {
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
};
