import { PushRepository } from "@/repositories/push.repository";
import { env } from "@/app/config/env";
import { urlBase64ToUint8Array } from "@/features/notifications/utils/vapid";
import { supabase } from "@/lib/supabase";

export const PushService = {
    
    /**
     * Checks if push notifications are supported in the current browser.
     * 
     * @returns {boolean}
     */
    isSupported: () => "serviceWorker" in navigator && "PushManager" in window,

    /**
     * Gets the current push subscription (if any).
     * 
     * @returns {Promise<PushSubscription|null>}
     */
    async getCurrentSubscription() {
        if (!PushService.isSupported()) return null;
        const registration = await navigator.serviceWorker.ready;
        return registration.pushManager.getSubscription();
    },

    /**
     * Requests permission and subscribes to push notifications.
     * 
     * @returns {Promise<PushSubscription>}
     * @throws {Error} If permission is denied.
     */
    async subscribe() {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") throw new Error("Notification permission denied");

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(env.vapidPublicKey),
        });

        const json = subscription.toJSON();
        await PushRepository.save({ 
            endpoint: json.endpoint, 
            p256dh: json.keys.p256dh, 
            authKey: json.keys.auth 
        });
        return subscription;
    },

    /**
     * Unsubscribes from push notifications and removes the subscription from the server.
     * 
     * @returns {Promise<void>}
     */
    async unsubscribe() {
        const subscription = await PushService.getCurrentSubscription();
        if (!subscription) return;
        await PushRepository.remove(subscription.endpoint);
        await subscription.unsubscribe();
    },

    /**
     * Fire-and-forget: sends a notification to the opposite role.
     * Never awaited by the caller's UI — failures are logged but do not block the action.
     * 
     * @param {Object} params
     * @param {string} params.title
     * @param {string} params.body
     * @param {string} params.url
     * @returns {Promise<void>}
     */
    async notifyOtherRole({ title, body, url }) {
        const { data } = await supabase.auth.getSession();
        if (!data.session) return;
        try {

            await fetch("/api/send-push", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${data.session.access_token}` 
                },
                body: JSON.stringify({ title, body, url }),
            });

        } catch (err) {
            console.error("Push notify failed:", err);
        }
    },
};