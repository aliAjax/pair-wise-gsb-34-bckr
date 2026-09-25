import { mockData } from "../mocks/seedData";
import type { InspectionTask } from "../types/InspectionTask";

const endpoint = "/api/inspection-task";

export async function listInspectionTask(scope: "all" | "pending" = "all"): Promise<InspectionTask[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(`${endpoint}?scope=${scope}`);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  const rows = [...(mockData.inspectionTask as unknown as InspectionTask[])];
  if (scope === "pending") {
    return rows.filter((row) => row.status !== "REVIEWED" || row.pinned_by_hazard);
  }
  return rows;
}

export async function saveInspectionTask(payload: InspectionTask) {
  console.info("save InspectionTask", payload);
  return payload;
}
