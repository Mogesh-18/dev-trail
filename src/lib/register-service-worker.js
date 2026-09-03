
/**
 * Registers the service worker on page load.
 * 
 * @returns {void}
 */
export function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((err) => console.error("SW registration failed:", err));
    });
}