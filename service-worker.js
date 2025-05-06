const CACHE_NAME = 'audio-recorder-pwa-v1'

// Arquivos para cache
const urlsToCache = ['/', '/index.html', '/manifest.json']

// Instalar o service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cache aberto')
      return cache.addAll(urlsToCache)
    }),
  )
})

// Ativar o service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
