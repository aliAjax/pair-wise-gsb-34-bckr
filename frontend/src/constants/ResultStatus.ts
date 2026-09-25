// 巡检结果判定：PASS 合格 / FAIL 不合格（不合格才会触发隐患单）
export const ResultStatus = ["PASS", "FAIL"] as const;
export type ResultStatus = (typeof ResultStatus)[number];
export const ResultStatusText: Record<ResultStatus, string> = {
  PASS: "合格",
  FAIL: "不合格"
};
