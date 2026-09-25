# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>

## 设备台账 × 隐患处理联动闭环

设备台账与隐患整改单强绑定，规则如下：

1. **不合格即开单/合并**：巡检结果判定为 `FAIL` 时，按「同一设备 + 同一检查项」只保留一张有效隐患单；已存在则合并（严重程度取更高者，结果并入 `merged_result_ids`），不存在则新建。
2. **严重程度决定责任人和期限**（`constants/hazard_policy.*`）：LOW→巡检员/30 天，MEDIUM→维保商/14 天，HIGH→维保商/7 天，CRITICAL→物业主管/2 天。
3. **整改证据齐全才进复验**：维保人员必须同时提交现场照片（`rectify_photo_url`）和修复说明（`rectify_note`），缺一返回 `RECTIFY_EVIDENCE_REQUIRED`，状态保持 `OPEN`。
4. **物业主管确认才能关单**：仅 `SUPERVISOR` 角色可对 `RECHECK` 状态单复验；确认设备恢复 → `CLOSED` 且设备恢复 `NORMAL`；驳回 → 退回 `OPEN`。
5. **有效隐患未关的硬约束**：
   - 设备不能登记正常（`PATCH /api/fire-device/{id}/status` 返回 `DEVICE_BLOCKED_BY_HAZARD`）；
   - 对应巡检任务被 `pinned_by_hazard` 钉在任务清单中（`GET /api/inspection-task?scope=pending`），即使已提交复核也不会消失。

隐患单状态机：`OPEN → RECHECK → CLOSED`（驳回退回 `OPEN`）；设备状态机：`NORMAL / ABNORMAL / REPAIRING / RETIRED`。

关键接口：

| 接口 | 说明 |
|---|---|
| `POST /api/inspection-result` | 录入检查项结果，FAIL 自动开单/合并并锁定设备 |
| `POST /api/hazard-ticket/{id}/rectify` | 维保提交整改（照片+说明），进入复验 |
| `POST /api/hazard-ticket/{id}/close` | 物业主管复验：`confirm=true` 关单，`false` 驳回 |
| `PATCH /api/fire-device/{id}/status` | 设备状态登记，有效隐患未关时禁止登记正常 |
| `GET /api/inspection-task?scope=pending` | 待办任务清单，隐患未关任务保留 |

前端通过右上角角色切换（巡检员/维保商/物业主管/审计员）演示 RBAC，角色经 `x-role` 请求头传到后端。

## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`
- 后端：进入 `backend` 后按技术栈运行开发命令，接口统一挂在 `/api`。


## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Redux Toolkit |
| 后端 | FastAPI + Python 3.11 + SQLAlchemy 2.0 |
| 数据库 | PostgreSQL 15 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
backend/src/routes, controllers, services, models, repositories, middlewares, constants, constructors, utils, types, config
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `fire-inspect`
- `FRONTEND_PORT`: 前端端口，默认 `20103`
- `BACKEND_PORT`: 后端端口，默认 `21103`
- `DB_PORT`: 数据库宿主机端口
- `DB_USER/DB_PASSWORD/DB_NAME`: 本地数据库凭据

## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: fire-inspect`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-fire-inspect}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- DeviceType: constants/DeviceType、types/DeviceType、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- InspectionStatus: constants/InspectionStatus、types/InspectionStatus、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- HazardSeverity: constants/HazardSeverity、types/HazardSeverity、constants/hazardPolicy（后端 hazard_policy.py）、constructors、logTemplates、errorMessages、HazardSeverityTag、隐患筛选均有引用。
- RectifyStatus（OPEN/RECHECK/CLOSED）: constants/RectifyStatus、types/RectifyStatus、后端 constants/rectify_status.py、repositories（有效隐患判定）、services（状态机流转）、logTemplates、HazardsPage、DashboardPage。
- DeviceStatus（NORMAL/ABNORMAL/REPAIRING/RETIRED）: constants/DeviceStatus、types/DeviceStatus、后端 constants/device_status.py、fire_device_service（登记阻断）、hazard_ticket_service（锁定/恢复）、DevicesPage。
- ResultStatus（PASS/FAIL）: constants/ResultStatus、types/ResultStatus、后端 constants/result_status.py、inspection_result_service（FAIL 触发隐患）、TasksPage 录入表单。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。隐患单字段（如 `rectify_photo_url`）同时出现在模型、种子、构造器、迁移 SQL、前端类型、mock、页面与日志模板中。

## License

MIT
