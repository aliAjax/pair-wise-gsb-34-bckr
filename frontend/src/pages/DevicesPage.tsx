import { useEffect } from "react";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { DeviceStatusText } from "../constants/DeviceStatus";
import { OPEN_RECTIFY_STATUS } from "../constants/RectifyStatus";
import { DeviceTypeText } from "../constants/DeviceType";
import type { DeviceStatus } from "../constants/DeviceStatus";
import type { DeviceType } from "../constants/DeviceType";

export function DevicesPage() {
  const device = useFireDeviceStore();
  const hazard = useHazardTicketStore();

  useEffect(() => {
    void device.load();
    void hazard.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openHazardsOf = (deviceId: number) =>
    hazard.rows.filter((t) => t.device_id === deviceId && OPEN_RECTIFY_STATUS.includes(t.rectify_status as never));

  const markNormal = async (id: number) => {
    // 有效隐患未关时后端会拒绝（DEVICE_BLOCKED_BY_HAZARD），错误直接展示
    await device.markStatus(id, "NORMAL");
    await hazard.load();
  };

  return (
    <section className="panel wide">
      <h2>消防设备台账</h2>
      <p className="hint">台账状态与隐患处理绑定：存在未关闭的有效隐患时，设备不能登记为正常。</p>
      {device.error && <p className="error">{device.error}</p>}
      <div className="table">
        {device.rows.map((row) => {
          const hazards = openHazardsOf(row.id);
          return (
            <article key={row.id} className="row hazard-row">
              <div className="cell">
                <strong>{row.device_code}</strong>
                <span className="sub">{DeviceTypeText[row.device_type as DeviceType] ?? row.device_type} · {row.floor} · {row.location_desc}</span>
              </div>
              <div className="cell">
                <StatusBadge value={row.status} />
                <span className="sub">{DeviceStatusText[row.status as DeviceStatus] ?? row.status}</span>
              </div>
              <div className="cell">
                {hazards.length > 0 ? (
                  <>
                    <span className="badge open-hazard">{hazards.length} 张有效隐患单</span>
                    {hazards.map((t) => (
                      <span key={t.id} className="sub">
                        #{t.id} {t.item_code} <HazardSeverityTag value={t.severity} />
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="sub">无未关闭隐患</span>
                )}
              </div>
              <div className="cell">
                {row.status !== "NORMAL" && (
                  <button className="action" onClick={() => void markNormal(row.id)}>登记正常</button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
