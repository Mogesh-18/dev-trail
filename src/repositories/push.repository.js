import { pushProvider } from "@/data-providers/supabase/push.provider";

/**
 * Repository wrapper for push subscription operations.
 * 
 * @type {{
 *   getSubscriptionForCurrentDevice: (endpoint: string) => Promise<Object|null>,
 *   save: (input: { endpoint: string, p256dh: string, authKey: string }) => Promise<void>,
 *   remove: (endpoint: string) => Promise<void>
 * }}
 */
export const PushRepository = {
    getSubscriptionForCurrentDevice: (endpoint) => pushProvider.getSubscriptionForCurrentDevice(endpoint),
    save: (input) => pushProvider.save(input),
    remove: (endpoint) => pushProvider.remove(endpoint),
};