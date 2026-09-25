import { mockData } from "../mocks/seedData";
import { postJson } from "./request";
import type { HazardTicket } from "../types/HazardTicket";

const endpoint = "/api/hazard-ticket";

export type HazardTicketResponse = HazardTicket & { merged?: boolean };

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

export async function saveHazardTicket(payload: HazardTicket) {
  console.info("save HazardTicket", payload);
  return payload;
}

// 从不合格检查项生成隐患单；同设备同检查项由后端合并为一张。
export async function createHazardTicket(resultId: number, severity: string): Promise<HazardTicketResponse> {
  return postJson<HazardTicketResponse>(endpoint, { result_id: resultId, severity });
}

// 维保人员提交现场照片和修复说明，单据进入复验。
export async function rectifyHazardTicket(ticketId: number, photoUrl: string, rectifyNote: string): Promise<HazardTicket> {
  return postJson<HazardTicket>(`${endpoint}/${ticketId}/rectify`, { photo_url: photoUrl, rectify_note: rectifyNote });
}

// 物业主管确认设备恢复后关单。
export async function closeHazardTicket(ticketId: number): Promise<HazardTicket> {
  return postJson<HazardTicket>(`${endpoint}/${ticketId}/close`);
}
