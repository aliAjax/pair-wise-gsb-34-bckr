import { StatusBadge } from "./StatusBadge";

export function DeviceLocationCell({ title = "DeviceLocationCell", value = "READY", floor, locationDesc }: { title?: string; value?: string; floor?: string; locationDesc?: string }) {
  if (floor !== undefined || locationDesc !== undefined) {
    return <span className="location-cell">{[floor, locationDesc].filter(Boolean).join(" · ")}</span>;
  }
  return <div className="shared-widget"><strong>{title}</strong><StatusBadge value={value} /></div>;
}
