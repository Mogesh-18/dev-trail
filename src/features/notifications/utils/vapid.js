
/**
 * Converts a base64-encoded VAPID key to a Uint8Array for PushManager.
 * 
 * @param {string} base64String - The base64 VAPID public key (with URL-safe chars).
 * @returns {Uint8Array}
 */
export function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    return Uint8Array.from(
        [...rawData].map((char) => char.charCodeAt(0))
    );
}