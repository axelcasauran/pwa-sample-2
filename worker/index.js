/**
 * Custom service-worker code — imported by the Workbox-generated SW via
 * next-pwa's `customWorkerDir` option (default: ./worker/).
 *
 * Purpose: belt-and-suspenders offline support for cold starts.
 *
 * Two layers:
 *
 * 1) Install-time priming: cache both '/' and '/_offline' in our own
 *    'offline-docs' cache using Promise.allSettled so a single fetch failure
 *    cannot abort the others (cache.addAll / Workbox precache are
 *    all-or-nothing and can leave the SW with no usable document if one URL
 *    blips during install).
 *
 * 2) Fetch-time cascade for navigations: try the network first (so online
 *    users always get fresh pages), then fall through to '/' from any cache,
 *    then to '/_offline' from any cache. Only if all three fail do we return
 *    Response.error() — which is what triggers the browser's native offline
 *    page, the thing we're trying to avoid.
 *
 * caches.match(..., { ignoreSearch: true }) searches *all* Cache Storage
 * caches, so entries in the Workbox precache cache and in our 'offline-docs'
 * cache are both reachable here.
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

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.mode !== "navigate") return;

  event.respondWith(
    (async () => {
      try {
        // Online path: always prefer the network for navigations so users
        // see fresh content when connectivity exists.
        return await fetch(req);
      } catch {
        // Offline cascade.
        const root = await caches.match("/", { ignoreSearch: true });
        if (root) return root;

        const offline = await caches.match("/_offline", { ignoreSearch: true });
        if (offline) return offline;

        return Response.error();
      }
    })()
  );
});
