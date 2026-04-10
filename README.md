# Nexus PWA

A Next.js Progressive Web App with **Local Database**, **QR Code Scanner**, and **Bluetooth** capabilities.

## Features

| Feature | Technology | Description |
|---------|-----------|-------------|
| **Local Database** | IndexedDB via `idb` | CRUD operations, categories, persistent storage |
| **QR Scanner** | `html5-qrcode` | Camera-based QR code scanning & decoding |
| **Bluetooth** | Web Bluetooth API | Device discovery, connection, service enumeration |
| **PWA** | `next-pwa` + Service Worker | Installable, offline-capable, cached assets |

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## PWA Installation

1. Build and run in production mode (`npm run build && npm start`)
2. Open in Chrome/Edge
3. Click the install icon in the address bar (or browser menu → "Install App")

## Browser Requirements

| Feature | Chrome | Edge | Firefox | Safari |
|---------|--------|------|---------|--------|
| IndexedDB | ✅ | ✅ | ✅ | ✅ |
| QR Scanner (Camera) | ✅ | ✅ | ✅ | ✅ |
| Web Bluetooth | ✅ | ✅ | ❌ | ❌ |
| PWA Install | ✅ | ✅ | ❌ | ✅ (iOS) |

> **Note:** Web Bluetooth requires HTTPS in production. Use `localhost` for development.

## Project Structure

```
nexus-pwa/
├── public/
│   ├── icons/            # PWA icons (192px, 512px)
│   ├── manifest.json     # PWA manifest
│   └── sw.js             # Service worker (fallback)
├── src/
│   ├── app/
│   │   ├── globals.css   # Global styles
│   │   ├── layout.tsx    # Root layout + meta
│   │   └── page.tsx      # Home screen (3 nav buttons)
│   ├── components/
│   │   ├── DatabaseView.tsx   # IndexedDB CRUD UI
│   │   ├── QRScannerView.tsx  # Camera QR scanner
│   │   └── BluetoothView.tsx  # BLE device manager
│   ├── lib/
│   │   ├── db.ts         # IndexedDB helper (idb)
│   │   └── bluetooth.ts  # Web Bluetooth helper
│   └── types/
│       └── web-bluetooth.d.ts
├── next.config.js        # Next.js + PWA config
├── tsconfig.json
└── package.json
```

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- **QR Code:** [`html5-qrcode`](https://github.com/mebjas/html5-qrcode)
- **Bluetooth:** [Web Bluetooth API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- **PWA:** [`next-pwa`](https://github.com/shadowwalker/next-pwa)
