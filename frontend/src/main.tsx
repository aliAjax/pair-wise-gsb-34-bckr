import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { routes } from "./router/routes";
import { StatusBadge } from "./components/common/StatusBadge";
import { DashboardPage } from "./pages/DashboardPage";
import { DevicesPage } from "./pages/DevicesPage";
import { TasksPage } from "./pages/TasksPage";
import { HazardsPage } from "./pages/HazardsPage";
import { ReportsPage } from "./pages/ReportsPage";
import { ROLES, RoleText, getCurrentRole, setCurrentRole } from "./utils/session";
import type { Role } from "./utils/session";
import "./styles.css";

const PAGE_BY_ROUTE: Record<string, () => React.JSX.Element> = {
  "/dashboard": DashboardPage,
  "/devices": DevicesPage,
  "/tasks": TasksPage,
  "/hazards": HazardsPage,
  "/reports": ReportsPage
};

function App() {
  const [active, setActive] = useState<string>(routes[0]?.route ?? "/dashboard");
  const [role, setRole] = useState<Role>(getCurrentRole());
  const current = routes.find((route) => route.route === active) ?? routes[0];
  const Page = PAGE_BY_ROUTE[current?.route ?? "/dashboard"] ?? DashboardPage;

  return (
    <div className="shell">
      <aside>
        <div className="brand">消防设施巡检维保平台</div>
        <nav>
          {routes.map((route) => (
            <button key={route.route} className={active === route.route ? "active" : ""} onClick={() => setActive(route.route)}>
              {route.name}
            </button>
          ))}
        </nav>
        <div className="role-switch">
          <label htmlFor="role-select">当前角色</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => {
              const next = e.target.value as Role;
              setCurrentRole(next);
              setRole(next);
            }}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{RoleText[r]}</option>
            ))}
          </select>
        </div>
      </aside>
      <main className="page">
        <section className="page-head">
          <div>
            <p className="eyebrow">fire-inspect</p>
            <h1>{current?.name ?? "工作台"}</h1>
          </div>
          <StatusBadge value={role} />
        </section>
        <Page />
      </main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
