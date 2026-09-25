import { create } from "zustand";
import { closeHazardTicket, createHazardTicket, listHazardTicket, rectifyHazardTicket } from "../api/HazardTicket";
import type { HazardTicket } from "../types/HazardTicket";

type State = {
  rows: HazardTicket[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  createFromResult: (resultId: number, severity: string) => Promise<boolean>;
  submitRectification: (ticketId: number, photoUrl: string, rectifyNote: string) => Promise<boolean>;
  confirmClose: (ticketId: number) => Promise<boolean>;
  clearError: () => void;
};

export const useHazardTicketStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listHazardTicket(), loading: false });
  },
  async createFromResult(resultId, severity) {
    try {
      await createHazardTicket(resultId, severity);
      await get().load();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  async submitRectification(ticketId, photoUrl, rectifyNote) {
    try {
      await rectifyHazardTicket(ticketId, photoUrl, rectifyNote);
      await get().load();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  async confirmClose(ticketId) {
    try {
      await closeHazardTicket(ticketId);
      await get().load();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  clearError() {
    set({ error: null });
  }
}));
