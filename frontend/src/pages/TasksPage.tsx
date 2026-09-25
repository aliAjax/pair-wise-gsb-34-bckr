import { useEffect } from "react";
import { ChecklistPanel } from "../components/common/ChecklistPanel";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { formatDate } from "../utils/formatters";

export function TasksPage() {
  const { rows: tasks, error, load, complete, clearError } = useInspectionTaskStore();
  const results = useInspectionResultStore((s) => s.rows);
  const loadResults = useInspectionResultStore((s) => s.load);
  const devices = useFireDeviceStore((s) => s.rows);
  const loadDevices = useFireDeviceStore((s) => s.load);
  const loadTickets = useHazardTicketStore((s) => s.load);
  const { hasOpenHazard } = useHazardFlow();

  useEffect(() => {
    void load();
    void loadResults();
    void loadDevices();
    void loadTickets();
  }, [load, loadResults, loadDevices, loadTickets]);

  const deviceCode = (deviceId: number) => devices.find((d) => d.id === deviceId)?.device_code ?? `#${deviceId}`;

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">inspection</p>
        <h1>巡检任务</h1>
      </div>
      <StatusBadge value="TASKS" />
    </section>

    {error && <div className="error-banner" onClick={clearError}>{error}</div>}

    <section className="panel wide">
      <h2>任务清单</h2>
      {tasks.length === 0 && <EmptyState title="暂无任务" />}
      {tasks.map((task) => {
        const taskResults = results.filter((r) => r.task_id === task.id);
        const blocked = taskResults.some((r) => hasOpenHazard(r.device_id));
        const done = task.status === "REVIEWED";
        return <article className="ticket" key={task.id}>
          <header className="ticket-head">
            <strong>任务 #{task.id} · {task.task_type}</strong>
            <span className="hint">计划 {formatDate(task.plan_date)}</span>
            <StatusBadge value={task.status} />
            <span className="form-inline">
              {blocked && <em className="hint">存在未关闭隐患，设备不能移出任务清单</em>}
              <button
                disabled={blocked || done}
                title={blocked ? "存在未关闭隐患，任务不能完成" : undefined}
                onClick={() => void complete(task.id)}
              >完成任务</button>
            </span>
          </header>
          <ChecklistPanel
            title="检查项"
            items={taskResults.map((r) => ({ label: `${deviceCode(r.device_id)} · ${r.item_code}`, status: r.result_status }))}
          />
        </article>;
      })}
    </section>
  </main>;
}
