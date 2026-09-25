import { useEffect, useState } from "react";
import { useInspectionTaskStore } from "../stores/InspectionTaskStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { InspectionStatusText } from "../constants/InspectionStatus";
import { HazardSeverity } from "../constants/HazardSeverity";
import { ResultStatus, ResultStatusText } from "../constants/ResultStatus";
import type { InspectionStatus } from "../constants/InspectionStatus";

function SubmitResultForm({ onDone }: { onDone: () => void }) {
  const result = useInspectionResultStore();
  const [taskId, setTaskId] = useState(1);
  const [deviceId, setDeviceId] = useState(1);
  const [itemCode, setItemCode] = useState("PRESSURE");
  const [status, setStatus] = useState<string>("PASS");
  const [severity, setSeverity] = useState<string>("MEDIUM");
  const [note, setNote] = useState("");
  const [feedback, setFeedback] = useState("");

  const submit = async () => {
    const res = await result.submit({
      task_id: Number(taskId),
      device_id: Number(deviceId),
      item_code: itemCode,
      result_status: status,
      severity,
      note
    });
    if (res) {
      setFeedback(
        res.hazard
          ? res.hazard_created
            ? `不合格：已按严重程度开立隐患单 #${res.hazard.id}（${res.hazard.severity}），设备已锁定`
            : `不合格：已并入隐患单 #${res.hazard.id}（同设备同检查项合并，严重程度 ${res.hazard.severity}）`
          : "合格：结果已记录"
      );
      onDone();
    }
  };

  return (
    <div className="panel">
      <h2>录入检查项结果</h2>
      <div className="rectify-form vertical">
        <label>任务 ID <input type="number" value={taskId} onChange={(e) => setTaskId(Number(e.target.value))} /></label>
        <label>设备 ID <input type="number" value={deviceId} onChange={(e) => setDeviceId(Number(e.target.value))} /></label>
        <label>检查项 <input value={itemCode} onChange={(e) => setItemCode(e.target.value)} /></label>
        <label>判定
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            {ResultStatus.map((s) => <option key={s} value={s}>{ResultStatusText[s]}</option>)}
          </select>
        </label>
        {status === "FAIL" && (
          <label>严重程度
            <select value={severity} onChange={(e) => setSeverity(e.target.value)}>
              {HazardSeverity.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
        )}
        <label>备注 <input value={note} onChange={(e) => setNote(e.target.value)} /></label>
        <button className="action" onClick={() => void submit()}>提交结果</button>
      </div>
      {result.error && <p className="error">{result.error}</p>}
      {feedback && <p className="hint">{feedback}</p>}
    </div>
  );
}

export function TasksPage() {
  const task = useInspectionTaskStore();
  const device = useFireDeviceStore();
  const [scope, setScope] = useState<"all" | "pending">("pending");

  const reload = () => {
    void task.load(scope);
    void device.load();
  };

  useEffect(() => {
    void task.load(scope);
    void device.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  const deviceLabel = (deviceId: number) => {
    const d = device.rows.find((row) => row.id === deviceId);
    return d ? d.device_code : `#${deviceId}`;
  };

  return (
    <section className="workbench">
      <div className="panel wide">
        <h2>巡检任务清单</h2>
        <p className="hint">
          有效隐患未关闭的任务会被钉在清单中，即使已提交复核也不会消失。
          <button className={scope === "pending" ? "action" : ""} onClick={() => setScope("pending")}>待办</button>
          <button className={scope === "all" ? "action" : ""} onClick={() => setScope("all")}>全部</button>
        </p>
        <div className="table">
          {task.rows.map((row) => (
            <article key={row.id} className="row hazard-row">
              <div className="cell">
                <strong>任务 #{row.id}（楼栋 {row.building_id}）</strong>
                <span className="sub">计划 {row.plan_date?.slice(0, 10)} · {row.task_type} · 清单 {row.checklist_version}</span>
              </div>
              <div className="cell">
                <StatusBadge value={row.status} />
                <span className="sub">{InspectionStatusText[row.status as InspectionStatus] ?? row.status}</span>
              </div>
              <div className="cell">
                {row.pinned_by_hazard ? (
                  <span className="badge open-hazard">隐患未关 {row.open_hazard_count} 项，保留清单</span>
                ) : (
                  <span className="sub">无未关隐患</span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
      <SubmitResultForm onDone={reload} />
    </section>
  );
}
