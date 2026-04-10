export interface BluetoothDeviceInfo {
  id: string;
  name: string;
  connected: boolean;
  services: string[];
  rssi?: number;
}

export function isBluetoothSupported(): boolean {
  return typeof navigator !== "undefined" && "bluetooth" in navigator;
}

export async function scanForDevices(): Promise<BluetoothDeviceInfo | null> {
  if (!isBluetoothSupported()) {
    throw new Error("Web Bluetooth API is not supported in this browser.");
  }

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

    const info: BluetoothDeviceInfo = {
      id: device.id,
      name: device.name || "Unknown Device",
      connected: false,
      services: [],
    };

    return info;
  } catch (err) {
    if ((err as Error).message?.includes("cancelled")) {
      return null;
    }
    throw err;
  }
}

export async function connectToDevice(
  device: BluetoothDeviceInfo
): Promise<{ device: BluetoothDeviceInfo; characteristics: string[] }> {
  const btDevice = await navigator.bluetooth.requestDevice({
    acceptAllDevices: true,
    optionalServices: [
      "battery_service",
      "device_information",
      "heart_rate",
      "generic_access",
    ],
  });

  const server = await btDevice.gatt!.connect();
  const services = await server.getPrimaryServices();

  const serviceNames = services.map((s) => s.uuid);
  const characteristics: string[] = [];

  for (const service of services) {
    try {
      const chars = await service.getCharacteristics();
      chars.forEach((c) => characteristics.push(c.uuid));
    } catch {
      // Some characteristics may not be readable
    }
  }

  return {
    device: {
      ...device,
      connected: true,
      services: serviceNames,
    },
    characteristics,
  };
}

export async function disconnectDevice(): Promise<void> {
  // Web Bluetooth doesn't expose a global disconnect — 
  // the GATT server reference must be held by the component
}

export async function readBatteryLevel(server: BluetoothRemoteGATTServer): Promise<number | null> {
  try {
    const service = await server.getPrimaryService("battery_service");
    const char = await service.getCharacteristic("battery_level");
    const value = await char.readValue();
    return value.getUint8(0);
  } catch {
    return null;
  }
}

export async function readDeviceInfo(
  server: BluetoothRemoteGATTServer
): Promise<Record<string, string>> {
  const info: Record<string, string> = {};
  try {
    const service = await server.getPrimaryService("device_information");
    const chars = [
      { uuid: "manufacturer_name_string", label: "Manufacturer" },
      { uuid: "model_number_string", label: "Model" },
      { uuid: "firmware_revision_string", label: "Firmware" },
    ];
    for (const c of chars) {
      try {
        const char = await service.getCharacteristic(c.uuid);
        const val = await char.readValue();
        info[c.label] = new TextDecoder().decode(val);
      } catch {
        // Characteristic not available
      }
    }
  } catch {
    // Service not available
  }
  return info;
}
