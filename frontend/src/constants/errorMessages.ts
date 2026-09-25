export const ERROR_MESSAGES = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  TICKET_NOT_FOUND: "隐患整改单不存在",
  DEVICE_NOT_FOUND: "消防设备不存在",
  TASK_NOT_FOUND: "巡检任务不存在",
  INVALID_TICKET_STATE: "当前隐患单状态不允许该操作",
  RECTIFY_EVIDENCE_REQUIRED: "提交整改必须包含现场照片和修复说明，否则不能进入复验",
  DEVICE_BLOCKED_BY_HAZARD: "存在未关闭的有效隐患，设备不能登记为正常",
  SUPERVISOR_REQUIRED: "仅物业主管可确认设备恢复并关单"
};
