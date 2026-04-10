@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  --bg-primary: #0a0a0f;
  --bg-secondary: #111118;
  --bg-card: #16161f;
  --bg-elevated: #1c1c28;
  --accent: #00e5a0;
  --accent-dim: #00e5a020;
  --accent-mid: #00e5a050;
  --accent-glow: #00e5a030;
  --text-primary: #e8e8ef;
  --text-secondary: #7a7a8e;
  --text-muted: #4a4a5e;
  --danger: #ff4d6a;
  --danger-dim: #ff4d6a20;
  --warning: #ffb84d;
  --warning-dim: #ffb84d20;
  --info: #4dabff;
  --info-dim: #4dabff20;
  --border: #222233;
  --border-hover: #333348;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --font-mono: 'JetBrains Mono', monospace;
  --font-body: 'Outfit', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
  -webkit-tap-highlight-color: transparent;
}

body {
  font-family: var(--font-body);
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100dvh;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* ═══ Scrollbar ═══ */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

/* ═══ Layout ═══ */
.app-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100dvh;
  position: relative;
  padding: 0 16px env(safe-area-inset-bottom, 0);
}

/* ═══ Header ═══ */
.app-header {
  padding: 48px 0 24px;
  text-align: center;
  position: relative;
}

.app-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: var(--accent);
  border-radius: 1px;
  opacity: 0.5;
}

.app-logo {
  font-family: var(--font-mono);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--accent);
  margin-bottom: 4px;
}

.app-logo span {
  color: var(--text-muted);
  font-weight: 400;
}

.app-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* ═══ Navigation Grid ═══ */
.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 0;
}

.nav-card {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 20px;
  overflow: hidden;
  -webkit-user-select: none;
  user-select: none;
}

.nav-card::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.25s;
  border-radius: inherit;
}

.nav-card:hover, .nav-card:active {
  border-color: var(--border-hover);
  transform: translateY(-1px);
}

.nav-card:active {
  transform: translateY(0) scale(0.99);
}

.nav-card[data-type="database"]::before {
  background: linear-gradient(135deg, var(--accent-dim), transparent 60%);
}
.nav-card[data-type="qrcode"]::before {
  background: linear-gradient(135deg, var(--info-dim), transparent 60%);
}
.nav-card[data-type="bluetooth"]::before {
  background: linear-gradient(135deg, var(--warning-dim), transparent 60%);
}

.nav-card:hover::before { opacity: 1; }

.nav-icon {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.nav-icon.db { background: var(--accent-dim); color: var(--accent); }
.nav-icon.qr { background: var(--info-dim); color: var(--info); }
.nav-icon.bt { background: var(--warning-dim); color: var(--warning); }

.nav-icon svg {
  width: 24px;
  height: 24px;
}

.nav-info {
  flex: 1;
  position: relative;
  z-index: 1;
}

.nav-title {
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 3px;
}

.nav-desc {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.nav-arrow {
  color: var(--text-muted);
  position: relative;
  z-index: 1;
  transition: transform 0.2s;
}

.nav-card:hover .nav-arrow { transform: translateX(3px); }

/* ═══ Screen Views ═══ */
.screen {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.screen-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 36px 0 20px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 20px;
}

.back-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s;
}

.back-btn:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

.screen-title {
  font-family: var(--font-mono);
  font-size: 1.1rem;
  font-weight: 600;
}

/* ═══ Database View ═══ */
.db-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.btn {
  font-family: var(--font-body);
  font-size: 0.82rem;
  font-weight: 500;
  border: none;
  border-radius: var(--radius-sm);
  padding: 10px 18px;
  cursor: pointer;
  transition: all 0.15s;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
}
.btn-primary:hover { filter: brightness(1.1); }
.btn-primary:active { filter: brightness(0.95); }

.btn-secondary {
  background: var(--bg-elevated);
  color: var(--text-secondary);
  border: 1px solid var(--border);
}
.btn-secondary:hover { background: var(--border); color: var(--text-primary); }

.btn-danger {
  background: var(--danger-dim);
  color: var(--danger);
  border: 1px solid transparent;
}
.btn-danger:hover { border-color: var(--danger); }

.btn-block {
  width: 100%;
  justify-content: center;
  padding: 14px;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ═══ Form ═══ */
.form-group {
  margin-bottom: 12px;
}

.form-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.form-input, .form-textarea, .form-select {
  width: 100%;
  font-family: var(--font-body);
  font-size: 0.9rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus, .form-textarea:focus, .form-select:focus {
  border-color: var(--accent);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-select {
  appearance: none;
  cursor: pointer;
}

/* ═══ Record List ═══ */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.record-item {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 14px 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: fadeIn 0.2s ease;
}

.record-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
  flex-shrink: 0;
  margin-top: 2px;
}

.record-badge.note { background: var(--accent-dim); color: var(--accent); }
.record-badge.scan { background: var(--info-dim); color: var(--info); }
.record-badge.device { background: var(--warning-dim); color: var(--warning); }

.record-body { flex: 1; min-width: 0; }

.record-title {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-content {
  font-size: 0.8rem;
  color: var(--text-secondary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.record-time {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.record-delete {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.15s;
  flex-shrink: 0;
}

.record-delete:hover { color: var(--danger); background: var(--danger-dim); }

/* ═══ Empty State ═══ */
.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
  opacity: 0.4;
}

.empty-text {
  font-size: 0.85rem;
}

/* ═══ QR Scanner ═══ */
.qr-container {
  margin-bottom: 20px;
}

.qr-viewfinder {
  width: 100%;
  aspect-ratio: 1;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  position: relative;
  border: 1px solid var(--border);
}

.qr-viewfinder video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.qr-viewfinder #qr-reader {
  width: 100% !important;
  border: none !important;
}

.qr-viewfinder #qr-reader video {
  border-radius: var(--radius-lg) !important;
}

#qr-reader__scan_region {
  min-height: 280px !important;
}

#qr-reader__dashboard {
  display: none !important;
}

.qr-result {
  background: var(--bg-card);
  border: 1px solid var(--accent);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-top: 16px;
  word-break: break-all;
}

.qr-result-label {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 6px;
}

.qr-result-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-family: var(--font-mono);
  line-height: 1.5;
}

/* ═══ Bluetooth ═══ */
.bt-device-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 16px;
  margin-bottom: 12px;
}

.bt-device-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.bt-device-name {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.bt-status {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 4px;
}

.bt-status.connected { background: var(--accent-dim); color: var(--accent); }
.bt-status.disconnected { background: var(--danger-dim); color: var(--danger); }

.bt-device-id {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}

.bt-services {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.bt-service-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 2px 8px;
  color: var(--text-secondary);
}

.bt-info-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}

.bt-info-label {
  color: var(--text-muted);
}

.bt-info-value {
  color: var(--text-primary);
  font-family: var(--font-mono);
}

/* ═══ Status Badge ═══ */
.status-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text-muted);
  padding: 8px 12px;
  background: var(--bg-card);
  border-radius: var(--radius-sm);
  margin-bottom: 16px;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-dot.warning { background: var(--warning); }
.status-dot.danger { background: var(--danger); }

/* ═══ Modal ═══ */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: fadeIn 0.15s ease;
}

.modal-content {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 24px 20px 36px;
  width: 100%;
  max-width: 480px;
  animation: slideUp 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-handle {
  width: 36px;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  margin: 0 auto 20px;
}

.modal-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 16px;
}

/* ═══ Toast ═══ */
.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 12px 20px;
  font-size: 0.85rem;
  color: var(--text-primary);
  z-index: 200;
  animation: toastIn 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@keyframes toastIn {
  from { opacity: 0; transform: translate(-50%, 16px); }
  to { opacity: 1; transform: translate(-50%, 0); }
}

/* ═══ PWA Install ═══ */
.pwa-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--text-muted);
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: 4px 10px;
  border-radius: 20px;
  margin-top: 12px;
}

.pwa-badge .dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
}
