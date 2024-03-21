const staticCacheName = "site-static-v4";
const dynamicCacheName = "site-dynamic-v1";

const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles/css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v141/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2'
];

self.addEventListener('install', (event) => {
    //console.log("Service worker installed!");
    event.waitUntil(
        caches.open(staticCacheName)
        .then(cache => {
            console.log("Caching assets!");
            cache.addAll(assets);
        })
    );
});

self.addEventListener('activate', (event) => {
    //console.log("Service worker activated!");
    event.waitUntil(
        caches.keys().then(keys => {
            //console.log(keys);\
            return Promise.all(keys
                .filter(key => key != staticCacheName)
                .map(key => caches.delete())
            );
        })
    )
});

self.addEventListener('fetch', (event) => {
    //console.log("fetch event occured", event);
    event.respondWith(
        caches.match(event.request)
        .then(cachRes => {
            return cachRes || fetch(event.request)
            .then(fetchRes => {
                return caches.open(dynamicCacheName)
                .then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    return fetchRes;
                });
            });
        })
    );
});