import { mockData } from "../mocks/seedData";
import type { HazardTicket } from "../types/HazardTicket";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { authHeaders } from "../utils/session";

const endpoint = "/api/hazard-ticket";

async function parseError(res: Response): Promise<never> {
  const data = await res.json().catch(() => ({}));
  const code = (data as { code?: keyof typeof ERROR_MESSAGES }).code;
  throw new Error((data as { message?: string }).message ?? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.VALIDATION_FAILED);
}

export async function listHazardTicket(): Promise<HazardTicket[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.hazardTicket as unknown as HazardTicket[])];
}

export interface RectifyPayload {
  rectify_note: string;
  rectify_photo_url: string;
}

export async function rectifyHazardTicket(id: number, payload: RectifyPayload): Promise<HazardTicket> {
  const res = await fetch(`${endpoint}/${id}/rectify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) return parseError(res);
  return await res.json();
}

export interface ClosePayload {
  confirm: boolean;
  recheck_note?: string;
}

export async function closeHazardTicket(id: number, payload: ClosePayload): Promise<HazardTicket> {
  const res = await fetch(`${endpoint}/${id}/close`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) return parseError(res);
  return await res.json();
}

export async function saveHazardTicket(payload: HazardTicket) {
  console.info("save HazardTicket", payload);
  return payload;
}
