/* eslint-disable no-restricted-globals */
import { ExpirationPlugin } from "workbox-expiration/ExpirationPlugin";
import { precacheAndRoute } from "workbox-precaching/precacheAndRoute";
import { registerRoute } from "workbox-routing/registerRoute";
import { CacheFirst } from "workbox-strategies/CacheFirst";

// precache WebPack assets
// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST || []);

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

self.skipWaiting();
