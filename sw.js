// Define the cache name (update this version when deploying new changes)
const CACHE_NAME = 'mess-menu-cache-v3';

// Install event: Precache essential resources
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log(`[Service Worker] Deleting old cache: ${cache}`);
                        return caches.delete(cache); // Remove outdated caches
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event: Network-first strategy for menu.json, network-only for others
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // Handle menu.json with a network-first strategy
    if (requestUrl.pathname.endsWith('menu.json')) {
        console.log('[Service Worker] Fetching menu.json with network-first strategy');
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache the updated menu.json
                    const clonedResponse = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });
                    return response; // Serve from network
                })
                .catch(() => {
                    // Fallback to cache if network fails
                    console.log('[Service Worker] Serving menu.json from cache');
                    return caches.match(event.request);
                })
        );
        return;
    }

    // For all other requests, use network-only mode
    event.respondWith(
        fetch(event.request).catch(() => {
            // Optional: Custom offline response for non-menu requests
            return new Response(
                'You are offline. Please check your internet connection.',
                { status: 503, statusText: 'Service Unavailable' }
            );
        })
    );
});







// self.addEventListener('install', (event) => {
//     console.log('Service Worker Installed');
//     // Skip waiting to activate immediately
//     self.skipWaiting();
// });

// self.addEventListener('activate', (event) => {
//     console.log('Service Worker Activated');
//     event.waitUntil(clients.claim());
// });

// // Fetch event: Always fetch resources from the network (no caching)
// self.addEventListener('fetch', (event) => {
//     console.log(`Fetching: ${event.request.url}`);
//     event.respondWith(fetch(event.request));  // Always fetch from the network
// });

// const SW_VERSION = '1.0.1';
// console.log(`Service Worker Version: ${SW_VERSION}`);
