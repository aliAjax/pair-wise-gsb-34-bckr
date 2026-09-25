export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_REQUIRED: "请先登录后再继续操作",
  RBAC_DENIED: "当前角色没有执行该动作的权限",
  VALIDATION_FAILED: "表单字段缺失或格式错误",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  TICKET_NOT_FOUND: "隐患整改单不存在",
  RESULT_NOT_FOUND: "巡检结果不存在",
  DEVICE_NOT_FOUND: "消防设备不存在",
  TASK_NOT_FOUND: "巡检任务不存在",
  RESULT_NOT_ABNORMAL: "仅不合格的检查项才能生成隐患整改单",
  RECTIFY_EVIDENCE_REQUIRED: "提交整改必须包含现场照片和修复说明",
  RECTIFY_STATUS_FORBIDDEN: "当前整改状态不允许该操作",
  DEVICE_HAS_OPEN_HAZARD: "存在未关闭的隐患整改单，设备不能登记正常或移出任务清单",
  INVALID_DEVICE_STATUS: "无效的设备状态",
  BACKEND_UNAVAILABLE: "后端服务不可用，请确认已启动后端"
};
