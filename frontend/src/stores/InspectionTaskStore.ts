import { create } from "zustand";
import { completeInspectionTask, listInspectionTask } from "../api/InspectionTask";
import type { InspectionTask } from "../types/InspectionTask";

type State = {
  rows: InspectionTask[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  complete: (taskId: number) => Promise<boolean>;
  clearError: () => void;
};

export const useInspectionTaskStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listInspectionTask(), loading: false });
  },
  async complete(taskId) {
    try {
      await completeInspectionTask(taskId);
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
