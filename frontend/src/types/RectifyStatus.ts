export const RectifyStatus = ["OPEN", "RECHECK", "CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = {
  OPEN: "待整改",
  RECHECK: "待复验",
  CLOSED: "已关闭"
};
