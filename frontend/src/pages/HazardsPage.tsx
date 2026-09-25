import { useEffect, useMemo, useState } from "react";
import { currentRole, rememberRole } from "../api/request";
import { EmptyState } from "../components/common/EmptyState";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { StatusBadge } from "../components/common/StatusBadge";
import { TimelineList } from "../components/common/TimelineList";
import { HazardSeverity, HazardSeverityPolicy } from "../constants/HazardSeverity";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { formatDate, formatRisk } from "../utils/formatters";
import type { HazardTicket } from "../types/HazardTicket";
import type { InspectionResult } from "../types/InspectionResult";

const ROLE_OPTIONS = [
  { value: "maintainer", label: "维保人员" },
  { value: "supervisor", label: "物业主管" },
  { value: "admin", label: "系统管理员" }
];

function CreateTicketRow({ result, deviceCode, existingTicket, onCreate }: {
  result: InspectionResult;
  deviceCode: string;
  existingTicket?: HazardTicket;
  onCreate: (severity: string) => Promise<unknown>;
}) {
  const [severity, setSeverity] = useState<string>("MEDIUM");
  const policy = HazardSeverityPolicy[severity as HazardSeverity];
  return <article className="row">
    <strong>{deviceCode} · {result.item_code}</strong>
    <span>{result.note || result.measured_value}</span>
    <span className="form-inline">
      <select value={severity} onChange={(event) => setSeverity(event.target.value)}>
        {HazardSeverity.map((level) => <option key={level} value={level}>{formatRisk(level)}</option>)}
      </select>
      <em className="hint">{policy.ownerLabel} · {policy.deadlineDays} 天内</em>
      <button onClick={() => void onCreate(severity)}>
        {existingTicket ? `并入隐患单 #${existingTicket.id}` : "生成隐患单"}
      </button>
    </span>
  </article>;
}

function RectifyForm({ ticketId, onSubmit }: { ticketId: number; onSubmit: (photo: string, note: string) => Promise<unknown> }) {
  const [photo, setPhoto] = useState("");
  const [note, setNote] = useState("");
  return <span className="form-inline">
    <input placeholder="现场照片 URL" value={photo} onChange={(event) => setPhoto(event.target.value)} />
    <input placeholder="修复说明" value={note} onChange={(event) => setNote(event.target.value)} />
    <button onClick={() => void onSubmit(photo, note)}>提交整改（进入复验）</button>
  </span>;
}

export function HazardsPage() {
  const { rows: tickets, error, load, createFromResult, submitRectification, confirmClose, clearError } = useHazardTicketStore();
  const results = useInspectionResultStore((s) => s.rows);
  const loadResults = useInspectionResultStore((s) => s.load);
  const devices = useFireDeviceStore((s) => s.rows);
  const loadDevices = useFireDeviceStore((s) => s.load);
  const [role, setRole] = useState(currentRole());

  useEffect(() => {
    void load();
    void loadResults();
    void loadDevices();
  }, [load, loadResults, loadDevices]);

  const deviceCode = (deviceId: number) => devices.find((d) => d.id === deviceId)?.device_code ?? `#${deviceId}`;
  const resultOf = (ticket: HazardTicket) => results.find((r) => r.id === ticket.result_id);

  // 不合格检查项；同设备同检查项已有有效隐患单时，前端提示将合并。
  const failedResults = useMemo(() => results.filter((r) => r.result_status === "FAIL"), [results]);
  const openTicketFor = (result: InspectionResult) =>
    tickets.find((ticket) => {
      if (ticket.rectify_status === "CLOSED") return false;
      const linked = resultOf(ticket);
      return linked?.device_id === result.device_id && linked?.item_code === result.item_code;
    });

  const switchRole = (next: string) => {
    rememberRole(next);
    setRole(next);
    clearError();
  };

  const afterMutation = async (ok: boolean) => {
    if (ok) await loadDevices();
  };

  const timelineOf = (ticket: HazardTicket) => {
    const policy = HazardSeverityPolicy[ticket.severity as HazardSeverity];
    const items = [`责任人 ${policy?.ownerLabel ?? `#${ticket.owner_id}`} · 期限 ${formatDate(ticket.deadline)}`];
    if (ticket.rectify_note) items.push(`整改提交：${ticket.rectify_note}（${ticket.rectify_photo_url}）`);
    if (ticket.closed_at) items.push(`复验关闭：${formatDate(ticket.closed_at)}`);
    return items;
  };

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">hazard</p>
        <h1>隐患整改</h1>
      </div>
      <label className="form-inline">当前角色
        <select value={role} onChange={(event) => switchRole(event.target.value)}>
          {ROLE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
    </section>

    {error && <div className="error-banner" onClick={clearError}>{error}</div>}

    <section className="panel wide">
      <h2>不合格检查项</h2>
      {failedResults.length === 0 && <EmptyState title="暂无不合格项" />}
      <div className="table">
        {failedResults.map((result) => <CreateTicketRow
          key={result.id}
          result={result}
          deviceCode={deviceCode(result.device_id)}
          existingTicket={openTicketFor(result)}
          onCreate={async (severity) => afterMutation(await createFromResult(result.id, severity))}
        />)}
      </div>
    </section>

    <section className="panel wide">
      <h2>隐患整改单</h2>
      {tickets.length === 0 && <EmptyState title="暂无隐患单" />}
      {tickets.map((ticket) => {
        const result = resultOf(ticket);
        return <article className="ticket" key={ticket.id}>
          <header className="ticket-head">
            <strong>#{ticket.id} {result ? `${deviceCode(result.device_id)} · ${result.item_code}` : `结果 ${ticket.result_id}`}</strong>
            <HazardSeverityTag title="严重程度" value={ticket.severity} />
            <StatusBadge value={ticket.rectify_status} />
          </header>
          <TimelineList title="流转记录" items={timelineOf(ticket)} />
          <footer className="ticket-actions">
            {ticket.rectify_status === "OPEN" && role !== "supervisor" &&
              <RectifyForm ticketId={ticket.id} onSubmit={async (photo, note) => afterMutation(await submitRectification(ticket.id, photo, note))} />}
            {ticket.rectify_status === "OPEN" && role === "supervisor" && <span className="hint">待维保人员提交现场照片和修复说明</span>}
            {ticket.rectify_status === "RECHECK" && role !== "maintainer" &&
              <button onClick={() => void confirmClose(ticket.id).then(afterMutation)}>复验通过，确认设备恢复并关单</button>}
            {ticket.rectify_status === "RECHECK" && role === "maintainer" && <span className="hint">待物业主管复验确认</span>}
            {ticket.rectify_status === "CLOSED" && <span className="hint">已关闭，设备台账已恢复正常</span>}
          </footer>
        </article>;
      })}
    </section>
  </main>;
}
