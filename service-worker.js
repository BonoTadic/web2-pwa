const CACHE_NAME = 'qr-scanner-v1';
const OFFLINE_URL = 'images/offline.png';
const ASSETS = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/scripts/main.js',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    OFFLINE_URL
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
            .catch(() => caches.match(OFFLINE_URL))
    );
});

self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            self.registration.showNotification('Sync Complete', {
                body: 'Data has been synchronized.',
                icon: 'icons/icon-192x192.png'
            })
        );
    }
});

self.addEventListener('push', event => {
    let data;
    try {
        data = event.data.json();
    } catch (error) {
        data = {
            title: 'New Message',
            body: event.data.text(),
            icon: 'icons/icon-192x192.png'
        };
    }

    const title = data.title || 'New Message';
    const options = {
        body: data.body || 'You have a new message!',
        icon: data.icon || 'icons/icon-192x192.png'
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
