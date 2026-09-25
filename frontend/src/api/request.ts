import { CURRENT_USER } from "../constants/currentUser";
import { ERROR_MESSAGES } from "../constants/errorMessages";

const ROLE_STORAGE_KEY = "fire-inspect-role";

export function currentRole(): string {
  try {
    return localStorage.getItem(ROLE_STORAGE_KEY) ?? CURRENT_USER.role;
  } catch {
    return CURRENT_USER.role;
  }
}

export function rememberRole(role: string) {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role);
  } catch {
    // 隐私模式下忽略，回退到默认角色。
  }
}

interface ErrorDetail {
  code?: string;
  message?: string;
}

export async function postJson<T>(url: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "x-role": currentRole() },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
  } catch {
    throw new Error(ERROR_MESSAGES.BACKEND_UNAVAILABLE);
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const detail: ErrorDetail = data?.detail ?? {};
    const message = detail.message ?? (detail.code ? ERROR_MESSAGES[detail.code] : undefined) ?? ERROR_MESSAGES.VALIDATION_FAILED;
    throw new Error(message);
  }
  return data as T;
}
