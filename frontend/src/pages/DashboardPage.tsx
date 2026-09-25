import { useMemo } from "react";
import { mockData } from "../mocks/seedData";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";

export function DashboardPage() {
  const entities = Object.entries(mockData);
  const total = useMemo(() => entities.reduce((sum, [, rows]) => sum + rows.length, 0), [entities]);
  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">fire-inspect</p>
        <h1>消防合规总览</h1>
      </div>
      <StatusBadge value="LOCAL_DATA" />
    </section>
    <section className="metrics">
      <StatCard label="核心模型" value={entities.length} />
      <StatCard label="本地记录" value={total} />
      <StatCard label="共享枚举" value={6} />
    </section>
    <section className="workbench">
      <div className="panel wide">
        <h2>业务数据</h2>
        <div className="table">
          {entities.map(([key, rows]) => <article key={key} className="row">
            <strong>{key}</strong><span>{rows.length} 条</span><StatusBadge value={Object.values(rows[0] ?? {})[1] as string ?? "READY"} />
          </article>)}
        </div>
      </div>
      <div className="panel">
        <h2>台账与隐患联动</h2>
        <p>不合格检查项按“同一设备 + 同一检查项”合并隐患单；维保提交照片和说明后进入复验；物业主管确认恢复才关单。有效隐患未关时，设备不能登记正常，也不能从任务清单消失。</p>
      </div>
    </section>
  </main>;
}
