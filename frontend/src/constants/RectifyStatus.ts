// 隐患整改单状态机：OPEN -> RECHECK -> CLOSED（复验驳回退回 OPEN）
export const RectifyStatus = ["OPEN", "RECHECK", "CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = {
  OPEN: "待整改",
  RECHECK: "待复验",
  CLOSED: "已关闭"
};
// 未关闭即“有效隐患”：设备台账与任务清单的联动判断都基于这个集合
export const OPEN_RECTIFY_STATUS: readonly RectifyStatus[] = ["OPEN", "RECHECK"];
