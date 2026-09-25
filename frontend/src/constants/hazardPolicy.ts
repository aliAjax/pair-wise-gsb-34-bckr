import type { HazardSeverity } from "./HazardSeverity";

// 严重程度 -> 整改责任人 / 整改期限（天），与后端 constants/hazard_policy.py 保持一致。
// 严重程度越高，责任人层级越高、期限越短。
export const HAZARD_POLICY: Record<
  HazardSeverity,
  { ownerRole: string; ownerRoleText: string; ownerId: number; deadlineDays: number }
> = {
  LOW: { ownerRole: "INSPECTOR", ownerRoleText: "巡检员", ownerId: 101, deadlineDays: 30 },
  MEDIUM: { ownerRole: "MAINTENANCE", ownerRoleText: "维保商", ownerId: 201, deadlineDays: 14 },
  HIGH: { ownerRole: "MAINTENANCE", ownerRoleText: "维保商", ownerId: 202, deadlineDays: 7 },
  CRITICAL: { ownerRole: "SUPERVISOR", ownerRoleText: "物业主管", ownerId: 301, deadlineDays: 2 }
};
