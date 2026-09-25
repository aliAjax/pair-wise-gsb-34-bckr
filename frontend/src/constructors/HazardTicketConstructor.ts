import type { HazardTicket } from "../types/HazardTicket";

export const createDefaultHazardTicket = (overrides: Partial<HazardTicket> = {}): HazardTicket => ({
  id: 1 as never,
  result_id: 1 as never,
  severity: "LOW" as never,
  owner_id: 101 as never,
  deadline: "2026-06-11T09:00:00Z" as never,
  rectify_status: "OPEN" as never,
  rectify_note: "" as never,
  rectify_photo_url: "" as never,
  closed_at: "" as never,
  ...overrides
});

export const createHazardTicketForm = createDefaultHazardTicket;
export const createHazardTicketResponse = createDefaultHazardTicket;
