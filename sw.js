const CACHE_NAME = 'raddished-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/credits.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    '/images/logo.png',
    '/images/hero-bg.jpg',
    '/images/game1.jpg',
    '/images/game2.jpg',
    '/images/game3.jpg',
    '/images/game4.jpg',
    '/images/game5.jpg',
    '/images/game6.jpg',
    '/images/game7.jpg',
    '/images/game8.jpg',
    '/images/game9.jpg',
    '/images/game10.jpg',
    '/images/game11.jpg',
    '/images/game12.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    });
            })
    );
}); 