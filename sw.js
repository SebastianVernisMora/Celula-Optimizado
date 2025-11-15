/**
 * Service Worker para Grupo Musical Célula
 * Maneja el cache de recursos estáticos
 */

const CACHE_NAME = 'celula-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/blog.html',
    '/cotizador.html',
    '/css/styles.css',
    '/js/navigation.js',
    '/js/optimizations.js',
    '/assets/logo/logo.jpg',
    '/assets/images/logo-blanco.png'
];

// Instalación del Service Worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('✅ Cache abierto');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache antiguo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar peticiones
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - devolver respuesta del cache
                if (response) {
                    return response;
                }

                // Clonar la petición
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Verificar si es una respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clonar la respuesta
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
