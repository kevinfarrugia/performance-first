/* eslint-disable no-restricted-globals */

import { CacheableResponsePlugin } from "workbox-cacheable-response/CacheableResponsePlugin";
import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing/registerRoute";
import { CacheFirst } from "workbox-strategies/CacheFirst";
import { StaleWhileRevalidate } from "workbox-strategies/StaleWhileRevalidate";

// precache WebPack assets
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache the Google Fonts stylesheets with a stale-while-revalidate strategy.
registerRoute(
  ({ url }) => url.origin === "https://fonts.googleapis.com",
  new StaleWhileRevalidate({
    cacheName: "google-fonts-stylesheets",
  })
);

// Cache the underlying font files with a cache-first strategy for 1 year.
registerRoute(
  ({ url }) => url.origin === "https://fonts.gstatic.com",
  new CacheFirst({
    cacheName: "google-fonts-webfonts",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 365,
        maxEntries: 30,
      }),
    ],
  })
);

// cache images for 30 days
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      }),
    ],
  })
);

// cache scripts and styles with a StaleWhileRevalidate strategy
registerRoute(
  ({ request }) =>
    request.destination === "script" || request.destination === "style",
  new StaleWhileRevalidate({
    cacheName: "static-resources",
  })
);

// cache JSON files with a StaleWhileRevalidate strategy
registerRoute(/\.json$/, new StaleWhileRevalidate());

self.skipWaiting();
