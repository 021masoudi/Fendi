const CACHE_NAME = 'fendi-inventory-cache-v1';
const urlsToCache = [
  '/',
  '/wp-content/plugins/fendi-inventory-system/public/css/fendi-inventory-system-public.css',
  '/wp-content/plugins/fendi-inventory-system/public/js/fendi-inventory-system-public.js',
  '/wp-content/plugins/fendi-inventory-system/admin/js/fendi-inventory-system-admin.js',
  '/wp-content/plugins/fendi-inventory-system/admin/css/fendi-inventory-system-admin.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncSales());
  }
});

function syncSales() {
  return idb.getAll('sales').then(sales => {
    return Promise.all(sales.map(sale => {
      return api.createOrder(sale).then(() => {
        return idb.delete('sales', sale.id);
      });
    }));
  });
}

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
