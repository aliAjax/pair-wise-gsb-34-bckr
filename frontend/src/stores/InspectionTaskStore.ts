import { create } from "zustand";
import { listInspectionTask } from "../api/InspectionTask";
import type { InspectionTask } from "../types/InspectionTask";

type State = {
  rows: InspectionTask[];
  loading: boolean;
  load: (scope?: "all" | "pending") => Promise<void>;
};

export const useInspectionTaskStore = create<State>((set) => ({
  rows: [],
  loading: false,
  async load(scope = "all") {
    set({ loading: true });
    set({ rows: await listInspectionTask(scope), loading: false });
  }
}));
