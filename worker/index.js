/**
 * Custom service-worker code — imported by the Workbox-generated SW via
 * next-pwa's `customWorkerDir` option (default: ./worker/).
 *
 * Purpose: belt-and-suspenders install-time priming for cold starts.
 *
 * Cache both '/' and '/_offline' in our own 'offline-docs' cache using
 * Promise.allSettled so a single fetch failure cannot abort the others
 * (Workbox precache is all-or-nothing and can leave the SW with no usable
 * document if one URL blips during install).
 *
 * Fetch-time routing is handled entirely by Workbox (precacheAndRoute for
 * precached assets, runtime caching routes for everything else, and the
 * fallback handler for offline navigations). We intentionally do NOT
 * register a fetch listener here — doing so would intercept navigations
 * before Workbox's PrecacheRoute and prevent it from serving cached
 * responses directly.
 */

const OFFLINE_DOCS_CACHE = "offline-docs";
const DOCS = ["/", "/_offline"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(OFFLINE_DOCS_CACHE).then((cache) =>
      Promise.allSettled(
        DOCS.map((url) =>
          // { cache: "reload" } bypasses the HTTP cache so we store a fresh copy.
          cache.add(new Request(url, { cache: "reload" }))
        )
      )
    )
  );
});
