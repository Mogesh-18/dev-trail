import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client with the service role key.
 * Used for privileged operations like verifying user tokens and upserting profiles.
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Mapping of authorized email addresses to their roles.
 * Values are read from environment variables (ADMIN_EMAIL and STUDENT_EMAIL).
 * 
 * @type {Record<string, 'admin'|'student'>}
 */
const ALLOWLIST = {
    [(process.env.ADMIN_EMAIL || "").toLowerCase()]: "admin",
    [(process.env.STUDENT_EMAIL || "").toLowerCase()]: "student",
};

/**
 * API route handler for the auth allowlist check.
 *
 * - Validates the bearer token from the `Authorization` header.
 * - Fetches the user's email from Supabase.
 * - Checks if the email is in the `ALLOWLIST` and retrieves the corresponding role.
 * - Upserts the user's profile with the role and updates the `last_login_at` timestamp.
 * - Returns `{ role }` on success, or an error response on failure.
 *
 * @param {import('next').NextApiRequest} req - The incoming request.
 * @param {import('next').NextApiResponse} res - The outgoing response.
 * @returns {Promise<void>}
 */
export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ 
            error: "Method not allowed" 
        });
        return;
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ 
            error: "Missing token" 
        });
        return;
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
        res.status(401).json({ 
            error: "Invalid session" 
        });
        return;
    }

    const { id, email } = userData.user;
    const role = ALLOWLIST[(email || "").toLowerCase()];
    if (!role) {
        res.status(403).json({ 
            error: "Account not authorized" 
        });
        return;
    }

    const { error: upsertError } = await supabaseAdmin.from("profiles").upsert({ 
        id, 
        email, 
        role, 
        last_login_at: new Date().toISOString() 
    }, { 
        onConflict: "id" 
    });

    if (upsertError) {
        res.status(500).json({ 
            error: "Could not finalize sign-in" 
        });
        return;
    }

    res.status(200).json({ 
        role 
    });
}