/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-globals */

import { ExpirationPlugin } from "workbox-expiration";
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { CacheFirst, StaleWhileRevalidate } from "workbox-strategies";

// eslint-disable-next-line no-underscore-dangle
precacheAndRoute(self.__WB_MANIFEST);

registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  new CacheFirst({
    cacheName: "images",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60,
      }),
    ],
  })
);

registerRoute(/\.json$/, new StaleWhileRevalidate());
