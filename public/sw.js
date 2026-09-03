
/**
 * The service worker cache name used for the app shell.
 * 
 * @type {string}
 */
const CACHE_NAME = "devtrail-shell-v1";

/**
 * URLs to precache during installation (app shell).
 * 
 * @type {string[]}
 */
const SHELL_URLS = ["/", "/index.html", "/manifest.webmanifest"];

/**
 * Service worker install event — precaches the app shell.
 * 
 * @event install
 * @param {InstallEvent} event - The install event.
 */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_URLS))
    );
    self.skipWaiting();
});

/**
 * Service worker activate event — removes old caches and claims clients.
 * 
 * @event activate
 * @param {ExtendableEvent} event - The activate event.
 */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

/**
 * Service worker fetch event — network-first for navigations, cache-first for assets.
 * 
 * @event fetch
 * @param {FetchEvent} event - The fetch event.
 */
self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;

    if (request.mode === "navigate") {
        event.respondWith(
            fetch(request).catch(() => caches.match("/index.html"))
        );
        return;
    }

    event.respondWith(
        caches.match(request).then((cached) => {
            const networkFetch = fetch(request)
                .then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                })
                .catch(() => cached);
            return cached || networkFetch;
        })
    );
});

/**
 * Service worker push event — displays a notification.
 * 
 * @event push
 * @param {PushEvent} event - The push event.
 */
self.addEventListener("push", (event) => {
    if (!event.data) return;
    const payload = event.data.json();
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            data: { 
                url: payload.url || "/" 
            },
        })
    );
});

/**
 * Service worker notification click event — opens the target URL.
 * 
 * @event notificationclick
 * @param {NotificationEvent} event - The notification click event.
 */
self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";
    event.waitUntil(
        self.clients.matchAll({ 
            type: "window", 
            includeUncontrolled: true 
        }).then((clients) => {
            const existing = clients.find((c) => c.url.includes(self.location.origin));
            if (existing) {
                existing.navigate(targetUrl);
                return existing.focus();
            }
            return self.clients.openWindow(targetUrl);
        })
    );
});