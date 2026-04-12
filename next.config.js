const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Build a content-based revision hash for a file.
const fileRevision = (file) =>
  crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex");

// Collect every file in public/ that isn't SW-generated, so they get precached.
// next-pwa skips its own public-file scan when additionalManifestEntries is set,
// so we replicate it here and add the start-url entry ("/") alongside.
const swGenerated = /^(sw|workbox-|worker-|fallback-)/;
function scanPublic(dir, prefix) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) return scanPublic(path.join(dir, e.name), prefix + e.name + "/");
    if (swGenerated.test(e.name) || e.name.endsWith(".map")) return [];
    return [{ url: "/" + prefix + e.name, revision: fileRevision(path.join(dir, e.name)) }];
  });
}
const publicEntries = scanPublic(path.join(__dirname, "public"), "");

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/",
  },
  // Precache the start-url HTML so the app loads on cold offline start.
  // Without this, '/' is only runtime-cached after the first online visit,
  // meaning a fresh launch from the home screen while offline has no HTML to
  // serve and the browser shows its default offline page.
  additionalManifestEntries: [
    { url: "/", revision: Date.now().toString() },
    ...publicEntries,
  ],
  // Cache navigation requests on client-side nav so pages are ready offline
  cacheOnFrontEndNav: true,
  runtimeCaching: [
    // Cache Next.js static assets (JS bundles, CSS, fonts) — offline critical
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-static",
        expiration: {
          maxEntries: 256,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    // Cache Next.js image optimization responses
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "next-images",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Cache self-hosted font files (downloaded by next/font at build time)
    {
      urlPattern: /\/fonts\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "fonts",
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    // Cache any Google Fonts requests (fallback if still requested)
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 8,
          maxAgeSeconds: 365 * 24 * 60 * 60,
        },
      },
    },
    // Cache PWA icons and manifest
    {
      urlPattern: /\/(icons|manifest\.json).*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "pwa-assets",
        expiration: {
          maxEntries: 16,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
      },
    },
    // Cache all page HTML — NetworkFirst so updates propagate,
    // falls back to cache when offline
    {
      urlPattern: /^https?:\/\/.*\/$/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "app-pages",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
      },
    },
    // Catch-all: NetworkFirst for anything else (API calls, external resources)
    {
      urlPattern: /^https?.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "app-cache",
        networkTimeoutSeconds: 10,
        expiration: {
          maxEntries: 128,
          maxAgeSeconds: 24 * 60 * 60,
        },
      },
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
