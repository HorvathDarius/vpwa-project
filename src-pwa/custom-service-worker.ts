/*
 * This file (which will be your service worker)
 * is picked up by the build system ONLY if
 * quasar.config.js > pwa > workboxMode is set to "injectManifest"
 */

declare const self: ServiceWorkerGlobalScope &
  typeof globalThis & { skipWaiting: () => void };

import { clientsClaim } from 'workbox-core';
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  // createHandlerBoundToURL,
} from 'workbox-precaching';
// import { registerRoute, NavigationRoute } from 'workbox-routing';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Non-SSR fallback to index.html
// Production SSR fallback to offline.html (except for dev)
// if (process.env.MODE !== 'ssr' || process.env.PROD) {
//   registerRoute(
//     new NavigationRoute(
//       createHandlerBoundToURL(process.env.PWA_FALLBACK_HTML),
//       { denylist: [/sw\.js$/, /workbox-(.)*\.js$/] }
//     )
//   );
// }

const FALLBACK_HTML_URL = '/error.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.add(
        FALLBACK_HTML_URL
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If there is a cached response, use it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If no network is available, return the fallback HTML page
        return fetch(event.request).catch(() => {
          return caches.match(FALLBACK_HTML_URL) as any;
        });
      })
  );
});