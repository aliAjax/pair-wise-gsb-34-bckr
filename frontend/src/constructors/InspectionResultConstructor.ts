import type { InspectionResult } from "../types/InspectionResult";

export const createDefaultInspectionResult = (overrides: Partial<InspectionResult> = {}): InspectionResult => ({
  id: 1 as never,
  task_id: 1 as never,
  device_id: 1 as never,
  item_code: "PRESSURE" as never,
  result_status: "PASS" as never,
  measured_value: "" as never,
  photo_url: "" as never,
  note: "" as never,
  ...overrides
});

export const createInspectionResultForm = createDefaultInspectionResult;
export const createInspectionResultResponse = createDefaultInspectionResult;
