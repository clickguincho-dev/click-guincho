// ============================================================
// CLICK GUINCHO — Service Worker (PWA + Cache Offline)
// ============================================================
const CACHE = 'cg-v2';
const STATIC = [
  '/', '/index.html', '/login.html', '/servicos.html',
  '/historico.html', '/perfil.html', '/acompanhamento.html',
  '/motorista.html', '/css/global.css', '/js/app.js', '/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('/api/') || e.request.url.includes('supabase')) return;
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request)));
});

// Push Notifications
self.addEventListener('push', e => {
  const d = e.data?.json() ?? {};
  e.waitUntil(self.registration.showNotification(d.title || 'Click Guincho', {
    body: d.body || 'Você tem uma atualização',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/icon-72.png',
    data: d.url || '/',
    vibrate: [200, 100, 200, 100, 200]
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data || '/'));
});
