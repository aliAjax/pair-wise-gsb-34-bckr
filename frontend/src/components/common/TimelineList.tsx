import { StatusBadge } from "./StatusBadge";

export function TimelineList({ title = "TimelineList", value = "READY", items = [] as string[] }: { title?: string; value?: string; items?: string[] }) {
  if (items.length === 0) {
    return <div className="shared-widget"><strong>{title}</strong><StatusBadge value={value} /></div>;
  }
  return <div className="shared-widget"><strong>{title}</strong><ul className="timeline">{items.map((item, index) => <li key={index}>{item}</li>)}</ul></div>;
}
