// 设备台账状态：NORMAL 正常 / ABNORMAL 隐患中 / REPAIRING 维修中 / RETIRED 已停用
export const DeviceStatus = ["NORMAL", "ABNORMAL", "REPAIRING", "RETIRED"] as const;
export type DeviceStatus = (typeof DeviceStatus)[number];
export const DeviceStatusText: Record<DeviceStatus, string> = {
  NORMAL: "正常",
  ABNORMAL: "隐患中",
  REPAIRING: "维修中",
  RETIRED: "已停用"
};
