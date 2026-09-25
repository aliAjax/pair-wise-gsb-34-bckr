import { useMemo } from "react";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import type { HazardTicket } from "../types/HazardTicket";

/**
 * 隐患单与设备台账的联动派生：
 * - 未关闭（OPEN/RECHECK）的隐患单视为有效隐患；
 * - 通过隐患单 -> 巡检结果 -> 设备 的引用链，算出每台设备的有效隐患；
 * - 设备存在有效隐患时，页面据此禁止“登记正常”和“完成任务”。
 */
export function useHazardFlow() {
  const tickets = useHazardTicketStore((s) => s.rows);
  const results = useInspectionResultStore((s) => s.rows);

  const openTickets = useMemo(
    () => tickets.filter((ticket) => ticket.rectify_status !== "CLOSED"),
    [tickets]
  );

  const openByDevice = useMemo(() => {
    const map = new Map<number, HazardTicket[]>();
    for (const ticket of openTickets) {
      const result = results.find((row) => row.id === ticket.result_id);
      if (!result) continue;
      map.set(result.device_id, [...(map.get(result.device_id) ?? []), ticket]);
    }
    return map;
  }, [openTickets, results]);

  const hasOpenHazard = (deviceId: number) => (openByDevice.get(deviceId) ?? []).length > 0;
  const canRectify = (ticket: HazardTicket) => ticket.rectify_status === "OPEN";
  const canClose = (ticket: HazardTicket) => ticket.rectify_status === "RECHECK";

  return { openTickets, openByDevice, hasOpenHazard, canRectify, canClose };
}
