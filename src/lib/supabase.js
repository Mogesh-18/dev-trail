import { createClient } from "@supabase/supabase-js";
import { env } from "@/app/config/env";

export const supabase = createClient(
    env.supabaseUrl, 
    env.supabaseAnonKey
);