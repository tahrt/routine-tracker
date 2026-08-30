/* Offline shell.
 *
 * Build placeholders are replaced in dist/sw.js by scripts/build-sw.mjs.
 * A unique cache name on every build makes deployed updates discoverable and
 * lets activation remove only obsolete app caches. User data is not stored here.
 */

const VERSION = 'rt-0f04f954c0fe-20260830144955';
const CORE = ["./","./index.html","./manifest.webmanifest","./icons/icon-192.png","./icons/icon-512.png","./icons/icon-maskable-512.png","./assets/index-B0Rv4N4k.js","./assets/index-DpYznJOv.css"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(CORE).catch(() => undefined)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('rt-') && k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const sameOrigin = url.origin === self.location.origin;

  // Navigations are network-first so reopening the Home Screen app gets the
  // latest index.html whenever online. The cached shell is only the fallback.
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).catch(() => caches.match('./index.html').then((r) => r ?? caches.match('./'))));
    return;
  }

  if (!sameOrigin && url.hostname !== 'fonts.googleapis.com' && url.hostname !== 'fonts.gstatic.com') return;

  // Hashed Vite assets are safe to serve cache-first. The network response is
  // still fetched and stored so non-hashed resources refresh in the background.
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            void caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached ?? network;
    }),
  );
});
