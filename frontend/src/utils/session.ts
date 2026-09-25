// 当前操作角色：与后端 auth_middleware 的 x-role 头对应，用于 RBAC 演示。
export const ROLES = ["INSPECTOR", "MAINTENANCE", "SUPERVISOR", "AUDITOR"] as const;
export type Role = (typeof ROLES)[number];

export const RoleText: Record<Role, string> = {
  INSPECTOR: "巡检员",
  MAINTENANCE: "维保商",
  SUPERVISOR: "物业主管",
  AUDITOR: "审计员"
};

const STORAGE_KEY = "fire-inspect-role";
let currentRole: Role = (localStorage.getItem(STORAGE_KEY) as Role) || "SUPERVISOR";

export const getCurrentRole = (): Role => currentRole;

export const setCurrentRole = (role: Role) => {
  currentRole = role;
  localStorage.setItem(STORAGE_KEY, role);
};

export const authHeaders = (): Record<string, string> => ({ "x-role": currentRole });
