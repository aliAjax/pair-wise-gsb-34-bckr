import { create } from "zustand";
import { listFireDevice, updateFireDeviceStatus } from "../api/FireDevice";
import type { FireDevice } from "../types/FireDevice";

type State = {
  rows: FireDevice[];
  loading: boolean;
  error: string | null;
  load: () => Promise<void>;
  markStatus: (id: number, status: string) => Promise<boolean>;
};

export const useFireDeviceStore = create<State>((set, get) => ({
  rows: [],
  loading: false,
  error: null,
  async load() {
    set({ loading: true });
    set({ rows: await listFireDevice(), loading: false });
  },
  async markStatus(id, status) {
    try {
      await updateFireDeviceStatus(id, status);
      set({ error: null });
      await get().load();
      return true;
    } catch (err) {
      // 有效隐患未关时后端会拒绝登记正常，错误消息直接展示在台账页
      set({ error: err instanceof Error ? err.message : String(err) });
      return false;
    }
  }
}));
