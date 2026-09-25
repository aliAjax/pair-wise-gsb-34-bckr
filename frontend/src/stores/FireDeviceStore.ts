import { create } from "zustand";
import { listFireDevice, updateFireDeviceStatus } from "../api/FireDevice";
import type { FireDevice } from "../types/FireDevice";

type State = {
  rows: FireDevice[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  setStatus: (deviceId: number, status: string) => Promise<boolean>;
  clearError: () => void;
};

export const useFireDeviceStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listFireDevice(), loading: false });
  },
  async setStatus(deviceId, status) {
    try {
      await updateFireDeviceStatus(deviceId, status);
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
