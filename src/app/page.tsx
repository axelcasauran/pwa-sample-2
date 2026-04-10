"use client";

import { useState, useEffect } from "react";
import DatabaseView from "@/components/DatabaseView";
import QRScannerView from "@/components/QRScannerView";
import BluetoothView from "@/components/BluetoothView";

type Screen = "home" | "database" | "qrcode" | "bluetooth";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [isPWA, setIsPWA] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    // Check if running as installed PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsPWA(isStandalone);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstall(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") setShowInstall(false);
  };

  if (screen === "database") {
    return (
      <div className="app-container">
        <DatabaseView onBack={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "qrcode") {
    return (
      <div className="app-container">
        <QRScannerView onBack={() => setScreen("home")} />
      </div>
    );
  }

  if (screen === "bluetooth") {
    return (
      <div className="app-container">
        <BluetoothView onBack={() => setScreen("home")} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          NEXUS<span>.pwa</span>
        </div>
        <div className="app-subtitle">Device Toolkit</div>
        <div className="pwa-badge">
          <span className="dot" />
          {isPWA ? "Installed" : "PWA Ready"}
        </div>
      </header>

      {showInstall && !isPWA && (
        <div style={{ padding: "0 20px 16px" }}>
          <button
            onClick={handleInstall}
            style={{
              width: "100%",
              padding: "14px",
              background: "rgba(0,229,160,0.12)",
              border: "1px solid rgba(0,229,160,0.4)",
              borderRadius: "12px",
              color: "#00e5a0",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            ⬇ Install Nexus App
          </button>
        </div>
      )}

      <nav className="nav-grid">
        {/* Database Button */}
        <div
          className="nav-card"
          data-type="database"
          onClick={() => setScreen("database")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setScreen("database")}
        >
          <div className="nav-icon db">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
          </div>
          <div className="nav-info">
            <div className="nav-title">Local Database</div>
            <div className="nav-desc">Browse, add & manage IndexedDB records</div>
          </div>
          <div className="nav-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {/* QR Code Button */}
        <div
          className="nav-card"
          data-type="qrcode"
          onClick={() => setScreen("qrcode")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setScreen("qrcode")}
        >
          <div className="nav-icon qr">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <path d="M21 14h-3v3" />
              <path d="M18 21v-3h3" />
            </svg>
          </div>
          <div className="nav-info">
            <div className="nav-title">QR Scanner</div>
            <div className="nav-desc">Scan & decode QR codes with camera</div>
          </div>
          <div className="nav-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>

        {/* Bluetooth Button */}
        <div
          className="nav-card"
          data-type="bluetooth"
          onClick={() => setScreen("bluetooth")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setScreen("bluetooth")}
        >
          <div className="nav-icon bt">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
            </svg>
          </div>
          <div className="nav-info">
            <div className="nav-title">Bluetooth</div>
            <div className="nav-desc">Discover & connect to nearby devices</div>
          </div>
          <div className="nav-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </nav>

      <div className="status-bar">
        <span className="status-dot" />
        <span>IndexedDB Active</span>
        <span style={{ margin: "0 4px", opacity: 0.3 }}>•</span>
        <span>Service Worker {isPWA ? "Installed" : "Ready"}</span>
      </div>
    </div>
  );
}
