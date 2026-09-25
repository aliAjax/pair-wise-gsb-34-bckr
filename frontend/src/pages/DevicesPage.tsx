import { useEffect } from "react";
import { DeviceLocationCell } from "../components/common/DeviceLocationCell";
import { EmptyState } from "../components/common/EmptyState";
import { StatusBadge } from "../components/common/StatusBadge";
import { useHazardFlow } from "../hooks/useHazardFlow";
import { useFireDeviceStore } from "../stores/FireDeviceStore";
import { useHazardTicketStore } from "../stores/HazardTicketStore";
import { useInspectionResultStore } from "../stores/InspectionResultStore";
import { formatDate } from "../utils/formatters";

export function DevicesPage() {
  const { rows: devices, error, load, setStatus, clearError } = useFireDeviceStore();
  const loadTickets = useHazardTicketStore((s) => s.load);
  const loadResults = useInspectionResultStore((s) => s.load);
  const { openByDevice, hasOpenHazard } = useHazardFlow();

  useEffect(() => {
    void load();
    void loadTickets();
    void loadResults();
  }, [load, loadTickets, loadResults]);

  return <main className="page">
    <section className="page-head">
      <div>
        <p className="eyebrow">ledger</p>
        <h1>消防设备台账</h1>
      </div>
      <StatusBadge value="LEDGER" />
    </section>

    {error && <div className="error-banner" onClick={clearError}>{error}</div>}

    <section className="panel wide">
      <h2>设备列表</h2>
      {devices.length === 0 && <EmptyState title="暂无设备" />}
      <div className="table">
        {devices.map((device) => {
          const blocked = hasOpenHazard(device.id);
          const openCount = (openByDevice.get(device.id) ?? []).length;
          return <article className="row" key={device.id}>
            <strong>{device.device_code}</strong>
            <DeviceLocationCell floor={device.floor} locationDesc={device.location_desc} />
            <StatusBadge value={device.device_type} />
            <StatusBadge value={device.status} />
            <span className="hint">下次维保 {formatDate(device.next_maintenance_at)}</span>
            <span className="form-inline">
              {blocked && <em className="hint">{openCount} 张隐患单未关闭</em>}
              <button
                disabled={blocked || device.status === "NORMAL"}
                title={blocked ? "存在未关闭隐患，不能登记正常" : undefined}
                onClick={() => void setStatus(device.id, "NORMAL")}
              >登记正常</button>
            </span>
          </article>;
        })}
      </div>
    </section>
  </main>;
}
