import { StatusBadge } from "../components/common/StatusBadge";

export function ReportsPage() {
  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">reports</p>
        <h1>合规报表</h1>
      </div>
      <StatusBadge value="REPORTS" />
    </section>
  </main>;
}
