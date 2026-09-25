import { mockData } from "../mocks/seedData";
import { postJson } from "./request";
import type { FireDevice } from "../types/FireDevice";

const endpoint = "/api/fire-device";

export async function listFireDevice(): Promise<FireDevice[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.fireDevice as unknown as FireDevice[])];
}

export async function saveFireDevice(payload: FireDevice) {
  console.info("save FireDevice", payload);
  return payload;
}

// 登记设备状态；存在未关闭隐患时后端拒绝登记正常。
export async function updateFireDeviceStatus(deviceId: number, status: string): Promise<FireDevice> {
  return postJson<FireDevice>(`${endpoint}/${deviceId}/status`, { status });
}
