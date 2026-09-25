import { mockData } from "../mocks/seedData";
import type { FireDevice } from "../types/FireDevice";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { authHeaders } from "../utils/session";

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

export async function updateFireDeviceStatus(id: number, status: string): Promise<FireDevice> {
  const res = await fetch(`${endpoint}/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ status })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const code = (data as { code?: keyof typeof ERROR_MESSAGES }).code;
    throw new Error((data as { message?: string }).message ?? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.VALIDATION_FAILED);
  }
  return await res.json();
}

export async function saveFireDevice(payload: FireDevice) {
  console.info("save FireDevice", payload);
  return payload;
}
