"use client";

import { useState, useEffect, useRef } from "react";
import { addRecord } from "@/lib/db";

interface DeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  gatt?: BluetoothRemoteGATTServer;
  services: string[];
  battery?: number | null;
  deviceInfo: Record<string, string>;
}

interface Props {
  onBack: () => void;
}

export default function BluetoothView({ onBack }: Props) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const btDeviceRef = useRef<BluetoothDevice | null>(null);

  useEffect(() => {
    setSupported(typeof navigator !== "undefined" && "bluetooth" in navigator);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const scanForDevice = async () => {
    setError(null);
    setScanning(true);

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [
          "battery_service",
          "device_information",
          "heart_rate",
          "generic_access",
        ],
      });

      btDeviceRef.current = device;

      const info: DeviceInfo = {
        id: device.id,
        name: device.name || "Unknown Device",
        connected: false,
        services: [],
        deviceInfo: {},
      };

      // Check if device already in list
      setDevices((prev) => {
        const exists = prev.find((d) => d.id === device.id);
        if (exists) return prev;
        return [...prev, info];
      });

      setScanning(false);
    } catch (err: any) {
      setScanning(false);
      if (err?.message?.includes("cancelled") || err?.code === 8) {
        // User cancelled — not an error
        return;
      }
      setError(err?.message || "Failed to scan for devices.");
    }
  };

  const connectToDevice = async (deviceId: string) => {
    setConnecting(deviceId);
    setError(null);

    try {
      // Re-request the device (Web Bluetooth requires user gesture per connection)
      const device = btDeviceRef.current;
      if (!device || device.id !== deviceId) {
        setError("Device reference lost. Please scan again.");
        setConnecting(null);
        return;
      }

      const server = await device.gatt!.connect();
      let serviceUUIDs: string[] = [];
      let battery: number | null = null;
      const devInfo: Record<string, string> = {};

      try {
        const services = await server.getPrimaryServices();
        serviceUUIDs = services.map((s) => s.uuid);
      } catch {
        // Some devices don't expose services
      }

      // Try reading battery
      try {
        const batteryService = await server.getPrimaryService("battery_service");
        const batteryChar = await batteryService.getCharacteristic("battery_level");
        const value = await batteryChar.readValue();
        battery = value.getUint8(0);
      } catch {
        // Battery service not available
      }

      // Try reading device info
      try {
        const infoService = await server.getPrimaryService("device_information");
        for (const [uuid, label] of [
          ["manufacturer_name_string", "Manufacturer"],
          ["model_number_string", "Model"],
          ["firmware_revision_string", "Firmware"],
          ["hardware_revision_string", "Hardware"],
          ["software_revision_string", "Software"],
        ]) {
          try {
            const char = await infoService.getCharacteristic(uuid);
            const val = await char.readValue();
            devInfo[label] = new TextDecoder().decode(val);
          } catch {}
        }
      } catch {
        // Device info service not available
      }

      setDevices((prev) =>
        prev.map((d) =>
          d.id === deviceId
            ? {
                ...d,
                connected: true,
                gatt: server,
                services: serviceUUIDs,
                battery,
                deviceInfo: devInfo,
              }
            : d
        )
      );

      showToast(`Connected to ${device.name || "device"}`);
    } catch (err: any) {
      setError(err?.message || "Failed to connect.");
    } finally {
      setConnecting(null);
    }
  };

  const disconnectDevice = async (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId);
    if (device?.gatt) {
      device.gatt.disconnect();
    }

    setDevices((prev) =>
      prev.map((d) =>
        d.id === deviceId
          ? { ...d, connected: false, gatt: undefined, services: [], battery: undefined, deviceInfo: {} }
          : d
      )
    );

    showToast("Device disconnected");
  };

  const saveDevice = async (device: DeviceInfo) => {
    await addRecord({
      title: device.name,
      content: `ID: ${device.id}\nServices: ${device.services.length}\n${
        Object.entries(device.deviceInfo)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      }`,
      category: "device",
      meta: {
        bluetoothId: device.id,
        services: device.services,
        battery: device.battery,
        ...device.deviceInfo,
      },
    });
    showToast("Device saved to database");
  };

  const formatServiceName = (uuid: string): string => {
    const knownServices: Record<string, string> = {
      "0000180f-0000-1000-8000-00805f9b34fb": "Battery",
      "0000180a-0000-1000-8000-00805f9b34fb": "Device Info",
      "0000180d-0000-1000-8000-00805f9b34fb": "Heart Rate",
      "00001800-0000-1000-8000-00805f9b34fb": "Generic Access",
      "00001801-0000-1000-8000-00805f9b34fb": "Generic Attribute",
    };
    return knownServices[uuid] || uuid.substring(0, 8) + "...";
  };

  if (supported === null) return null;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="screen-title">Bluetooth</span>
      </div>

      <div className="status-bar">
        <span className={`status-dot ${supported ? "" : "danger"}`} />
        <span>
          {supported
            ? `Web Bluetooth API available • ${devices.filter((d) => d.connected).length} connected`
            : "Web Bluetooth not supported"}
        </span>
      </div>

      {!supported ? (
        <div
          style={{
            background: "var(--danger-dim)",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius-md)",
            padding: 16,
            fontSize: "0.85rem",
            color: "var(--danger)",
            marginBottom: 16,
          }}
        >
          <strong>Not Supported</strong>
          <br />
          Web Bluetooth API requires Chrome, Edge, or Opera on desktop/Android.
          iOS Safari does not support it yet.
        </div>
      ) : (
        <>
          <button
            className="btn btn-primary btn-block"
            onClick={scanForDevice}
            disabled={scanning}
            style={{ marginBottom: 16 }}
          >
            {scanning ? (
              <>
                <span className="status-dot" style={{ width: 8, height: 8 }} />
                Scanning...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
                </svg>
                Scan for Devices
              </>
            )}
          </button>
        </>
      )}

      {error && (
        <div
          style={{
            background: "var(--danger-dim)",
            border: "1px solid var(--danger)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            marginBottom: 12,
            fontSize: "0.85rem",
            color: "var(--danger)",
          }}
        >
          {error}
        </div>
      )}

      {devices.length === 0 && supported && (
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4">
              <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
            </svg>
          </div>
          <div className="empty-text">
            No devices discovered yet. Tap &quot;Scan&quot; to find nearby Bluetooth devices.
          </div>
        </div>
      )}

      {devices.map((device) => (
        <div className="bt-device-card" key={device.id}>
          <div className="bt-device-header">
            <div className="bt-device-name">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2">
                <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
              </svg>
              {device.name}
            </div>
            <span className={`bt-status ${device.connected ? "connected" : "disconnected"}`}>
              {device.connected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="bt-device-id">ID: {device.id}</div>

          {device.connected && (
            <>
              {device.battery != null && (
                <div className="bt-info-row">
                  <span className="bt-info-label">Battery</span>
                  <span className="bt-info-value">{device.battery}%</span>
                </div>
              )}

              {Object.entries(device.deviceInfo).map(([key, value]) => (
                <div className="bt-info-row" key={key}>
                  <span className="bt-info-label">{key}</span>
                  <span className="bt-info-value">{value}</span>
                </div>
              ))}

              {device.services.length > 0 && (
                <div style={{ marginTop: 10 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.7rem",
                      color: "var(--text-muted)",
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.06em",
                      marginBottom: 6,
                    }}
                  >
                    Services ({device.services.length})
                  </div>
                  <div className="bt-services">
                    {device.services.map((s) => (
                      <span className="bt-service-tag" key={s}>
                        {formatServiceName(s)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            {device.connected ? (
              <>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => saveDevice(device)}
                >
                  Save to DB
                </button>
                <button
                  className="btn btn-danger"
                  style={{ flex: 1 }}
                  onClick={() => disconnectDevice(device.id)}
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => connectToDevice(device.id)}
                disabled={connecting === device.id}
              >
                {connecting === device.id ? "Connecting..." : "Connect"}
              </button>
            )}
          </div>
        </div>
      ))}

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
