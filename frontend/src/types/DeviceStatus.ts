export const DeviceStatus = ["NORMAL","HAZARD_OPEN"] as const;
export type DeviceStatus = (typeof DeviceStatus)[number];
export const DeviceStatusText: Record<DeviceStatus, string> = Object.fromEntries(DeviceStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<DeviceStatus, string>;
