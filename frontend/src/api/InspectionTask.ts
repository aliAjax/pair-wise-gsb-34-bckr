import { mockData } from "../mocks/seedData";
import { postJson } from "./request";
import type { InspectionTask } from "../types/InspectionTask";

const endpoint = "/api/inspection-task";

export async function listInspectionTask(): Promise<InspectionTask[]> {
  if (typeof fetch !== "undefined" && endpoint.startsWith("/api") && true) {
    try {
      const res = await fetch(endpoint);
      if (res.ok) return await res.json();
    } catch {
      // Local mock fallback keeps the UI available during offline review.
    }
  }
  return [...(mockData.inspectionTask as unknown as InspectionTask[])];
}

export async function saveInspectionTask(payload: InspectionTask) {
  console.info("save InspectionTask", payload);
  return payload;
}

// 完成任务（移出待办清单）；任务内设备存在未关闭隐患时后端拒绝。
export async function completeInspectionTask(taskId: number): Promise<InspectionTask> {
  return postJson<InspectionTask>(`${endpoint}/${taskId}/complete`);
}
