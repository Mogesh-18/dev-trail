import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";

/**
 * Supabase admin client for privileged operations (service role key).
 * 
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Configures web-push with VAPID keys.
 * 
 * @type {void}
 */
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VITE_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

/**
 * Maximum length for notification title.
 * 
 * @type {number}
 */
const MAX_TITLE_LENGTH = 100;

/**
 * Maximum length for notification body.
 * 
 * @type {number}
 */
const MAX_BODY_LENGTH = 300;

/**
 * API route handler that sends a push notification to the opposite role
 * (admin→student or student→admin).
 * 
 * - Verifies the caller's session and role.
 * - Derives the recipient role server-side (never from request body).
 * - Fetches the recipient's push subscriptions.
 * - Sends notifications and cleans up stale subscriptions (404/410).
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

    const { data: callerProfile } = await supabaseAdmin.from("profiles").select("role").eq("id", userData.user.id).single();
    if (!callerProfile) {
        res.status(403).json({ 
            error: "Account not recognized" 
        });
        return;
    }

    const recipientRole = callerProfile.role === "admin" ? "student" : "admin";
    const title = String(req.body?.title || "").slice(0, MAX_TITLE_LENGTH);
    const body = String(req.body?.body || "").slice(0, MAX_BODY_LENGTH);
    const url = typeof req.body?.url === "string" ? req.body.url : "/";

    if (!title) {
        res.status(400).json({ 
            error: "Missing title" 
        });
        return;
    }

    const { data: recipientProfile } = await supabaseAdmin.from("profiles").select("id").eq("role", recipientRole).single();
    if (!recipientProfile) {
        res.status(200).json({ 
            sent: 0 
        }); // no recipient configured yet — not an error
        return;
    }

    const { data: subscriptions } = await supabaseAdmin.from("push_subscriptions").select("*").eq("user_id", recipientProfile.id);
    if (!subscriptions?.length) {
        res.status(200).json({ 
            sent: 0 
        });
        return;
    }

    const payload = JSON.stringify({ 
        title, 
        body, 
        url 
    });
    const results = await Promise.allSettled(
        subscriptions.map((sub) =>
            webpush.sendNotification(
                { 
                    endpoint: sub.endpoint, 
                    keys: { 
                        p256dh: sub.p256dh, 
                        auth: sub.auth_key 
                    } 
                },
                payload
            )
        )
    );

    const staleIds = results.map(
        (result, i) => (result.status === "rejected" && [404, 410].includes(result.reason?.statusCode) ? subscriptions[i].id : null)
    ).filter(Boolean);

    if (staleIds.length) {
        await supabaseAdmin.from("push_subscriptions").delete().in("id", staleIds);
    }

    res.status(200).json({ 
        sent: results.filter((r) => r.status === "fulfilled").length 
    });
}