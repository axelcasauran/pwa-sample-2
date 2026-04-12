/**
 * Custom service-worker code — imported by the Workbox-generated SW via
 * next-pwa's `customWorkerDir` option (default: ./worker/).
 *
 * Purpose: belt-and-suspenders caching of the start-url ("/") during the
 * SW install event, using the raw Cache API.  If Workbox's precache route
 * ever fails to serve "/", the fallback handler does
 *   caches.match("/")          // searches ALL caches
 * and will still find this entry in the "start-url" cache.
 */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("start-url").then((cache) =>
      // { cache: "reload" } bypasses the HTTP cache so we store a fresh copy.
      cache.add(new Request("/", { cache: "reload" }))
    )
  );
});
