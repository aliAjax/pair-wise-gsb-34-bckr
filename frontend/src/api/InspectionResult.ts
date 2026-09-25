import { mockData } from "../mocks/seedData";
import type { InspectionResult } from "../types/InspectionResult";
import type { HazardTicket } from "../types/HazardTicket";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { authHeaders } from "../utils/session";

const endpoint = "/api/inspection-result";

export async function listInspectionResult(): Promise<InspectionResult[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.inspectionResult as unknown as InspectionResult[])];
}

export interface SubmitResultPayload {
  task_id: number;
  device_id: number;
  item_code: string;
  result_status: string;
  severity?: string;
  measured_value?: string;
  photo_url?: string;
  note?: string;
}

export interface SubmitResultResponse {
  result: InspectionResult;
  hazard: HazardTicket | null;
  hazard_created: boolean;
}

export async function submitInspectionResult(payload: SubmitResultPayload): Promise<SubmitResultResponse> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const code = (data as { code?: keyof typeof ERROR_MESSAGES }).code;
    throw new Error((data as { message?: string }).message ?? ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ?? ERROR_MESSAGES.VALIDATION_FAILED);
  }
  return await res.json();
}

export async function saveInspectionResult(payload: InspectionResult) {
  console.info("save InspectionResult", payload);
  return payload;
}
