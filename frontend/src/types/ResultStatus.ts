export const ResultStatus = ["PASS","FAIL"] as const;
export type ResultStatus = (typeof ResultStatus)[number];
export const ResultStatusText: Record<ResultStatus, string> = Object.fromEntries(ResultStatus.map((value) => [value, value.replace(/_/g, " ")])) as Record<ResultStatus, string>;
