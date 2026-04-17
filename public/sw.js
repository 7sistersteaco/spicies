const CACHE_NAME = 'seven-sisters-static-v2';
const OFFLINE_URL = '/offline';

const STATIC_ASSETS = [
  OFFLINE_URL,
  '/',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/images/tea-hero.svg',
  '/images/product-ctc.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 0. Exclude sensitive or dynamic routes (Network Only)
  if (
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/checkout') ||
    url.pathname.startsWith('/account') ||
    url.pathname.startsWith('/api') ||
    url.pathname.includes('/?') || // Ignore parameterized routes
    request.method !== 'GET'
  ) {
    return;
  }

  // 1. Navigation strategy (Network-first with offline fallback)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 2. Static assets strategy (Cache-first, stale-while-revalidate)
  if (
    request.destination === 'font' || 
    request.destination === 'script' || 
    request.destination === 'style' ||
    request.destination === 'image'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }).catch(() => null);
        return cached || networkFetch;
      })
    );
  }
});
