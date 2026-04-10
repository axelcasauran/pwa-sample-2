"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { addRecord } from "@/lib/db";

interface Props {
  onBack: () => void;
}

export default function QRScannerView({ onBack }: Props) {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const stopScanner = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {
        // Ignore cleanup errors
      }
      scannerRef.current = null;
    }
    setScanning(false);
    setCameraReady(false);
  }, []);

  const startScanner = useCallback(async (facing: "user" | "environment" = facingMode) => {
    setError(null);
    setResult(null);

    try {
      const { Html5Qrcode } = await import("html5-qrcode");

      // Clean up previous instance
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {}
      }

      const scanner = new Html5Qrcode("qr-reader-element");
      scannerRef.current = scanner;

      setScanning(true);

      await scanner.start(
        { facingMode: facing },
        {
          fps: 10,
          qrbox: { width: 220, height: 220 },
          aspectRatio: 1.0,
        },
        (decodedText: string) => {
          setResult(decodedText);
          stopScanner();
        },
        () => {
          // QR code not detected — expected during scanning
        }
      );

      setCameraReady(true);
    } catch (err: any) {
      setScanning(false);
      setCameraReady(false);
      if (err?.message?.includes("NotAllowedError") || err?.name === "NotAllowedError") {
        setError("Camera permission denied. Please allow camera access and try again.");
      } else if (err?.message?.includes("NotFoundError") || err?.name === "NotFoundError") {
        setError("No camera found on this device.");
      } else {
        setError(err?.message || "Failed to start camera.");
      }
    }
  }, [stopScanner, facingMode]);

  const switchCamera = useCallback(async () => {
    const next = facingMode === "user" ? "environment" : "user";
    setFacingMode(next);
    await stopScanner();
    await startScanner(next);
  }, [facingMode, stopScanner, startScanner]);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        try {
          scannerRef.current.stop();
          scannerRef.current.clear();
        } catch {}
      }
    };
  }, []);

  const saveToDatabase = async () => {
    if (!result) return;
    await addRecord({
      title: "QR Scan",
      content: result,
      category: "scan",
      meta: { source: "qr-scanner", scannedAt: new Date().toISOString() },
    });
    showToast("Saved to database");
  };

  const copyToClipboard = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      showToast("Copied to clipboard");
    } catch {
      showToast("Failed to copy");
    }
  };

  const isURL = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={() => { stopScanner(); onBack(); }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="screen-title">QR Scanner</span>
      </div>

      <div className="status-bar">
        <span className={`status-dot ${scanning ? "" : error ? "danger" : "warning"}`} />
        <span>
          {scanning
            ? cameraReady
              ? "Camera active — Point at QR code"
              : "Starting camera..."
            : result
            ? "Scan complete"
            : "Camera standby"}
        </span>
      </div>

      <div className="qr-container">
        <div className="qr-viewfinder" ref={containerRef}>
          <div id="qr-reader-element" style={{ width: "100%" }} />
          {!scanning && !result && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                color: "var(--text-muted)",
              }}
            >
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="3" height="3" />
                <path d="M21 14h-3v3" />
                <path d="M18 21v-3h3" />
              </svg>
              <span style={{ fontSize: "0.8rem" }}>Tap start to begin scanning</span>
            </div>
          )}
        </div>
      </div>

      {!scanning && !result && (
        <button className="btn btn-primary btn-block" onClick={() => startScanner()}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
          Start Scanner
        </button>
      )}

      {scanning && (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={switchCamera}
            disabled={!cameraReady}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
            </svg>
            {facingMode === "user" ? "Switch to Rear" : "Switch to Front"}
          </button>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={stopScanner}
          >
            Stop Scanner
          </button>
        </div>
      )}

      {error && (
        <div
          style={{
            background: "var(--danger-dim)",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            marginTop: 12,
            fontSize: "0.85rem",
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      {result && (
        <>
          <div className="qr-result">
            <div className="qr-result-label">Decoded Result</div>
            <div className="qr-result-value">{result}</div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveToDatabase}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17,21 17,13 7,13 7,21" />
                <polyline points="7,3 7,8 15,8" />
              </svg>
              Save to DB
            </button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={copyToClipboard}>
              Copy
            </button>
            {isURL(result) && (
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ flex: 1, textDecoration: "none", textAlign: "center" }}
              >
                Open Link
              </a>
            )}
          </div>

          <button
            className="btn btn-secondary btn-block"
            onClick={() => { setResult(null); startScanner(); }}
            style={{ marginTop: 8 }}
          >
            Scan Again
          </button>
        </>
      )}

      {toast && (
        <div className="toast">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  );
}
