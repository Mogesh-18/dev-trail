import { createClient } from "@supabase/supabase-js";
import { env } from "@/app/config/env";

/**
 * The Supabase client instance, configured with the project URL and anon key.
 * Use this for all database and storage operations.
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(
    env.supabaseUrl, 
    env.supabaseAnonKey
);