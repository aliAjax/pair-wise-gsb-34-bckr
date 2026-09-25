import { useState } from "react";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { EmptyState } from "../components/common/EmptyState";
import { RectifyStatusText } from "../constants/RectifyStatus";
import { HAZARD_POLICY } from "../constants/hazardPolicy";
import { RoleText, getCurrentRole } from "../utils/session";
import type { HazardSeverity } from "../constants/HazardSeverity";
import type { RectifyStatus } from "../constants/RectifyStatus";

function RectifyForm({ onSubmit }: { onSubmit: (note: string, photo: string) => void }) {
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState("");
  return (
    <div className="rectify-form">
      <input
        placeholder="现场照片 URL（必填）"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
      />
      <input
        placeholder="修复说明（必填）"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button className="action" onClick={() => onSubmit(note, photo)}>提交整改并进入复验</button>
    </div>
  );
}

export function HazardsPage() {
  const flow = useHazardFlow();
  const role = getCurrentRole();

  const deviceLabel = (deviceId: number) => {
    const device = flow.devices.find((d) => d.id === deviceId);
    return device ? `${device.device_code} · ${device.location_desc}` : `设备#${deviceId}`;
  };

  return (
    <section className="panel wide">
      <h2>隐患整改单（{flow.openCount} 张有效单未关闭）</h2>
      <p className="hint">
        当前角色：{RoleText[role]}。维保提交现场照片和修复说明后才进入复验；仅物业主管确认设备恢复才能关单。
      </p>
      {flow.error && <p className="error">{flow.error}</p>}
      {flow.rows.length === 0 && <EmptyState title="暂无隐患单" />}
      <div className="table">
        {flow.rows.map((ticket) => {
          const policy = HAZARD_POLICY[ticket.severity as HazardSeverity];
          return (
            <article key={ticket.id} className="row hazard-row">
              <div className="cell">
                <strong>#{ticket.id} {deviceLabel(ticket.device_id)}</strong>
                <span className="sub">检查项 {ticket.item_code} · 合并结果 {ticket.merged_result_ids.length} 条</span>
              </div>
              <div className="cell">
                <HazardSeverityTag value={ticket.severity} />
                <span className="sub">责任人 {policy?.ownerRoleText ?? ticket.owner_id} · 期限 {ticket.deadline}</span>
              </div>
              <div className="cell">
                <StatusBadge value={ticket.rectify_status} />
                <span className="sub">{RectifyStatusText[ticket.rectify_status as RectifyStatus]}</span>
              </div>
              <div className="cell grow">
                {ticket.rectify_note && (
                  <span className="sub">整改：{ticket.rectify_note}（{ticket.rectify_photo_url || "无照片"}）</span>
                )}
                {ticket.recheck_note && <span className="sub">复验：{ticket.recheck_note}</span>}
                {flow.canRectify(ticket) && (
                  <RectifyForm
                    onSubmit={(note, photo) => void flow.rectify(ticket.id, { rectify_note: note, rectify_photo_url: photo })}
                  />
                )}
                {flow.canClose(ticket) && (
                  <div className="rectify-form">
                    <button className="action" onClick={() => void flow.close(ticket.id, { confirm: true, recheck_note: "现场复核合格，设备恢复" })}>
                      确认设备恢复并关单
                    </button>
                    <button className="action danger" onClick={() => void flow.close(ticket.id, { confirm: false, recheck_note: "复验不合格，退回整改" })}>
                      驳回退回整改
                    </button>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
