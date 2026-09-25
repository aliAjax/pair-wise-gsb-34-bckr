export const HazardSeverity = ["LOW","MEDIUM","HIGH","CRITICAL"] as const;
export type HazardSeverity = (typeof HazardSeverity)[number];
export const HazardSeverityText: Record<HazardSeverity, string> = Object.fromEntries(HazardSeverity.map((value) => [value, value.replace(/_/g, " ")])) as Record<HazardSeverity, string>;

// 与后端 constants/hazard_severity.py 的 SEVERITY_POLICY 保持一致：严重程度决定责任人和期限。
export const HazardSeverityPolicy: Record<HazardSeverity, { ownerId: number; ownerLabel: string; deadlineDays: number }> = {
  LOW: { ownerId: 101, ownerLabel: "维保员", deadlineDays: 30 },
  MEDIUM: { ownerId: 201, ownerLabel: "维保班长", deadlineDays: 7 },
  HIGH: { ownerId: 301, ownerLabel: "维保主管", deadlineDays: 3 },
  CRITICAL: { ownerId: 401, ownerLabel: "物业工程负责人", deadlineDays: 1 }
};
