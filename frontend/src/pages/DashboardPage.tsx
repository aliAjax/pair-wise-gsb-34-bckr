import { useEffect } from "react";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { StatCard } from "../components/common/StatCard";
import { StatusBadge } from "../components/common/StatusBadge";
import { HazardSeverityTag } from "../components/common/HazardSeverityTag";
import { EmptyState } from "../components/common/EmptyState";
import { OPEN_RECTIFY_STATUS } from "../constants/RectifyStatus";

export function DashboardPage() {
  const device = useFireDeviceStore();
  const hazard = useHazardTicketStore();

  useEffect(() => {
    void device.load();
    void hazard.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openTickets = hazard.rows.filter((t) => OPEN_RECTIFY_STATUS.includes(t.rectify_status as never));
  const abnormalDevices = device.rows.filter((d) => d.status === "ABNORMAL");
  const recheckCount = openTickets.filter((t) => t.rectify_status === "RECHECK").length;

  return (
    <>
      <section className="metrics">
        <StatCard label="设备总数" value={device.rows.length} />
        <StatCard label="隐患中设备" value={abnormalDevices.length} />
        <StatCard label="有效隐患单（待复验）" value={`${openTickets.length}（${recheckCount}）`} />
      </section>
      <section className="panel wide">
        <h2>未关闭隐患</h2>
        {openTickets.length === 0 && <EmptyState title="当前没有未关闭的隐患" />}
        <div className="table">
          {openTickets.map((t) => (
            <article key={t.id} className="row">
              <strong>#{t.id} 设备 {t.device_id} · {t.item_code}</strong>
              <HazardSeverityTag value={t.severity} />
              <StatusBadge value={t.rectify_status} />
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
