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
} from 'workbox-precaching';

self.skipWaiting();
clientsClaim();

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

const FALLBACK_HTML_URL = '/error.html';

// done with help of Service Worker API example and ChatGPT 

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open('my-cache').then((cache) => {
      return cache.add(
        FALLBACK_HTML_URL
      );
    })
  );
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
self.addEventListener('fetch', (event: any) => {
  event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If there is a cached response, use it
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // If no network is available, return the fallback HTML page
        return fetch(event.request).catch(() => {
          return caches.match(FALLBACK_HTML_URL) as Promise<Response>;
        });
      })
  );
});