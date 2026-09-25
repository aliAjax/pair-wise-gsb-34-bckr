export const RectifyStatus = ["OPEN","RECHECK","CLOSED"] as const;
export type RectifyStatus = (typeof RectifyStatus)[number];
export const RectifyStatusText: Record<RectifyStatus, string> = Object.fromEntries(RectifyStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<RectifyStatus, string>;
