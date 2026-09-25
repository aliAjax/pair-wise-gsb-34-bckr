import type { HazardTicket } from "../types/HazardTicket";

export const createDefaultHazardTicket = (overrides: Partial<HazardTicket> = {}): HazardTicket => ({
  id: 1 as never,
  result_id: 1 as never,
  device_id: 1 as never,
  item_code: "PRESSURE" as never,
  severity: "MEDIUM" as never,
  owner_id: 201 as never,
  deadline: "" as never,
  rectify_status: "OPEN" as never,
  rectify_note: "" as never,
  rectify_photo_url: "" as never,
  merged_result_ids: [] as never,
  rectified_at: "" as never,
  recheck_note: "" as never,
  closed_at: "" as never,
  ...overrides
});

export const createHazardTicketForm = createDefaultHazardTicket;
export const createHazardTicketResponse = createDefaultHazardTicket;
