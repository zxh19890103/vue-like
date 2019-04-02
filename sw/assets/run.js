const cacheName = 'v1'
const assets = [
    '/app.js'
]

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheName).then(c => {
        return c.addAll(assets)
    }).then(() => {
        return self.skipWaiting()
    }))
})

self.addEventListener('fetch', (event) => {
    console.log('Fetch', event.request)
    event.respondWith(caches.match(event.request).then(response => {
        return response || fetch(event.request)
    }))
})