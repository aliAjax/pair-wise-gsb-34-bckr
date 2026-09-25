import { HazardSeverityText } from "../../constants/HazardSeverity";
import type { HazardSeverity } from "../../constants/HazardSeverity";

export function HazardSeverityTag({ value }: { value: string }) {
  const text = HazardSeverityText[value as HazardSeverity] ?? value;
  return <span className={"badge severity-" + value.toLowerCase()}>{text}</span>;
}
