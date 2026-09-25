import { StatusBadge } from "./StatusBadge";

export type ChecklistItem = { label: string; status: string };

export function ChecklistPanel({ title = "ChecklistPanel", value = "READY", items = [] as ChecklistItem[] }: { title?: string; value?: string; items?: ChecklistItem[] }) {
  if (items.length === 0) {
    return <div className="shared-widget"><strong>{title}</strong><StatusBadge value={value} /></div>;
  }
  return <div className="shared-widget"><strong>{title}</strong>{items.map((item, index) => <div className="checklist-row" key={index}><span>{item.label}</span><StatusBadge value={item.status} /></div>)}</div>;
}
