import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const ALLOWLIST = {
    [(process.env.ADMIN_EMAIL || "").toLowerCase()]: "admin",
    [(process.env.STUDENT_EMAIL || "").toLowerCase()]: "student",
};

export default async function handler(req, res) {
    if (req.method !== "POST") {
        res.status(405).json({ error: "Method not allowed" });
        return;
    }

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
        res.status(401).json({ error: "Missing token" });
        return;
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
    if (userError || !userData?.user) {
        res.status(401).json({ error: "Invalid session" });
        return;
    }

    const { id, email } = userData.user;
    const role = ALLOWLIST[(email || "").toLowerCase()];

    if (!role) {
        res.status(403).json({ error: "Account not authorized" });
        return;
    }

    const { error: upsertError } = await supabaseAdmin
        .from("profiles")
        .upsert(
            { id, email, role, last_login_at: new Date().toISOString() },
            { onConflict: "id" }
        );

    if (upsertError) {
        res.status(500).json({ error: "Could not finalize sign-in" });
        return;
    }

    res.status(200).json({ role });
}