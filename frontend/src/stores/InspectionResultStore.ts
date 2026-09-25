import { create } from "zustand";
import { listInspectionResult, submitInspectionResult } from "../api/InspectionResult";
import type { SubmitResultPayload, SubmitResultResponse } from "../api/InspectionResult";
import type { InspectionResult } from "../types/InspectionResult";

type State = {
  rows: InspectionResult[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  submit: (payload: SubmitResultPayload) => Promise<SubmitResultResponse | null>;
};

export const useInspectionResultStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listInspectionResult(), loading: false });
  },
  async submit(payload) {
    try {
      const res = await submitInspectionResult(payload);
      set({ error: null });
      await get().load();
      return res;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : String(err) });
      return null;
    }
  }
}));
