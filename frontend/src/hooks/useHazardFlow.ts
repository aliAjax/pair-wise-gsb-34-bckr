import { useEffect } from "react";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { getCurrentRole } from "../utils/session";
import { OPEN_RECTIFY_STATUS } from "../constants/RectifyStatus";
import type { HazardTicket } from "../types/HazardTicket";

/**
 * 隐患流转 hook：把隐患单、设备台账和当前角色绑定在一起。
 * - 维保（MAINTENANCE）可对 OPEN 单提交整改（照片+说明）进入复验
 * - 物业主管（SUPERVISOR）可对 RECHECK 单确认恢复关单 / 驳回
 * - 任何流转完成后同步刷新设备台账，保证状态一致
 */
export function useHazardFlow() {
  const hazard = useHazardTicketStore();
  const device = useFireDeviceStore();
  const role = getCurrentRole();

  useEffect(() => {
    void hazard.load();
    void device.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshAll = async () => {
    await Promise.all([hazard.load(), device.load()]);
  };

  const canRectify = (ticket: HazardTicket) =>
    ticket.rectify_status === "OPEN" && (role === "MAINTENANCE" || role === "SUPERVISOR");

  const canClose = (ticket: HazardTicket) =>
    ticket.rectify_status === "RECHECK" && role === "SUPERVISOR";

  const rectify = async (id: number, payload: { rectify_note: string; rectify_photo_url: string }) => {
    const ok = await hazard.rectify(id, payload);
    if (ok) await refreshAll();
    return ok;
  };

  const close = async (id: number, payload: { confirm: boolean; recheck_note?: string }) => {
    const ok = await hazard.close(id, payload);
    if (ok) await refreshAll();
    return ok;
  };

  const openCount = hazard.rows.filter((row) => OPEN_RECTIFY_STATUS.includes(row.rectify_status as never)).length;

  return {
    rows: hazard.rows,
    devices: device.rows,
    loading: hazard.loading || device.loading,
    error: hazard.error ?? device.error,
    role,
    openCount,
    canRectify,
    canClose,
    rectify,
    close,
    refreshAll
  };
}
