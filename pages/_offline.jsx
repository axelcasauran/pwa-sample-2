/**
 * Offline fallback page — served by the service worker when all other
 * caching strategies fail (precache miss + runtime cache miss).
 *
 * This should rarely appear because '/' is precached during SW install.
 * It exists as a last-resort safety net so the user never sees the
 * browser's bare "You're offline" chrome.
 */
import { useEffect } from "react";
import Head from "next/head";

export default function OfflineFallback() {
  // If '/' is actually cached somewhere, redirect there immediately.
  useEffect(() => {
    caches.match("/").then((res) => {
      if (res) window.location.replace("/");
    });
  }, []);

  return (
    <>
      <Head>
        <title>PWA Test — Offline</title>
        <meta name="theme-color" content="#00e5a0" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </Head>

      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00e5a0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
          </div>
          <h1 style={styles.title}>You&apos;re Offline</h1>
          <p style={styles.subtitle}>
            Open the app while online once to cache it for full offline use.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={styles.button}
          >
            Try Again
          </button>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0a0a0f",
    fontFamily: "'Outfit', system-ui, -apple-system, sans-serif",
    padding: "24px",
  },
  card: {
    textAlign: "center",
    maxWidth: 340,
  },
  iconWrap: {
    marginBottom: 24,
  },
  title: {
    color: "#e8e8ef",
    fontSize: 22,
    fontWeight: 600,
    margin: "0 0 12px",
  },
  subtitle: {
    color: "#7a7a8e",
    fontSize: 15,
    lineHeight: 1.5,
    margin: "0 0 28px",
  },
  button: {
    background: "rgba(0,229,160,0.12)",
    border: "1px solid rgba(0,229,160,0.35)",
    borderRadius: 12,
    color: "#00e5a0",
    fontSize: 15,
    fontWeight: 600,
    padding: "14px 32px",
    cursor: "pointer",
    width: "100%",
  },
};
