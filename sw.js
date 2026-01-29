const CACHE_NAME = 'ai-blog-v1';
const urlsToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Estrategia de cache: Network First, fallback to Cache
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si la respuesta es válida, guardarla en cache
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Si falla la red, intentar obtener del cache
        return caches.match(event.request)
          .then(response => {
            if (response) {
              return response;
            }
            
            // Si es una navegación y no está en cache, mostrar página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Manejo de mensajes desde el cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Sincronización en segundo plano (para acciones offline)
self.addEventListener('sync', event => {
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

async function syncPosts() {
  // Implementar lógica de sincronización si es necesario
  console.log('Sincronizando posts...');
}

// Notificaciones push (opcional)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva actualización disponible',
    icon: '/assets/images/icon-192x192.png',
    badge: '/assets/images/icon-96x96.png',
    vibrate: [200, 100, 200],
    tag: 'notification',
    requireInteraction: false
  };

  event.waitUntil(
    self.registration.showNotification('AI Tech Blog', options)
  );
});

// Click en notificación
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/')
  );
});
