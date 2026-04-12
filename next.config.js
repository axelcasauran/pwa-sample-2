const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  // Precache the app document so it loads from cache even on first offline launch.
  // Workbox adds '/' to the precache manifest during SW install — no network needed.
  fallbacks: {
    document: "/",
  },
  // Explicitly add the HTML shell to the precache manifest.
  // Without this, '/' is NOT in the precache and the fallback has nothing to serve.
  // The SW fetches and stores '/' during installation on the very first online visit.
  additionalManifestEntries: [
    { url: "/", revision: null },
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
