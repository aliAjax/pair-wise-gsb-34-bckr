import { create } from "zustand";
import { listHazardTicket, rectifyHazardTicket, closeHazardTicket } from "../api/HazardTicket";
import type { RectifyPayload, ClosePayload } from "../api/HazardTicket";
import type { HazardTicket } from "../types/HazardTicket";

type State = {
  rows: HazardTicket[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  rectify: (id: number, payload: RectifyPayload) => Promise<boolean>;
  close: (id: number, payload: ClosePayload) => Promise<boolean>;
};

export const useHazardTicketStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listHazardTicket(), loading: false });
  },
  async rectify(id, payload) {
    try {
      await rectifyHazardTicket(id, payload);
      set({ error: null });
      await get().load();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  },
  async close(id, payload) {
    try {
      await closeHazardTicket(id, payload);
      set({ error: null });
      await get().load();
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  }
}));
