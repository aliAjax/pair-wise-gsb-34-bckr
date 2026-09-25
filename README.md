# 消防设施巡检维保平台

面向园区和物业公司的消防设备巡检、隐患整改、维保计划和合规台账系统。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20103>

后端健康检查：<http://localhost:21103/health>


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
- HazardSeverity: constants/HazardSeverity、types/HazardSeverity、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用；严重度策略（责任人/期限）见后端 `constants/hazard_severity.py` 的 `SEVERITY_POLICY` 与前端 `constants/HazardSeverity.ts` 的 `HazardSeverityPolicy`。
- RectifyStatus（OPEN/RECHECK/CLOSED）: 后端 `constants/rectify_status.py`，前端 `constants/RectifyStatus.ts`、`types/RectifyStatus.ts`，并出现在 logTemplates、statusText、HazardsPage 与隐患单状态流转按钮显隐中。
- DeviceStatus（NORMAL/HAZARD_OPEN）: 后端 `constants/device_status.py`，前端 `constants/DeviceStatus.ts`、`types/DeviceStatus.ts`，并出现在 statusText、DevicesPage 状态徽标与“登记正常”守卫中。
- ResultStatus（PASS/FAIL）: 后端 `constants/result_status.py`，前端 `constants/ResultStatus.ts`、`types/ResultStatus.ts`，并出现在 statusText、HazardsPage 不合格项列表与 TasksPage 检查项面板中。

## 台账与隐患联动规则

设备台账（FireDevice.status）与隐患处理（HazardTicket.rectify_status）强绑定，规则由后端 service 强制，前端只做展示和入口：

1. **合并生成**：仅 `FAIL` 的巡检结果可生成隐患单（`POST /api/hazard-ticket`）；同一设备同一检查项只保留一张有效（未关闭）隐患单，重复异常合并进原单——严重度取高者并按 `SEVERITY_POLICY` 重算责任人和期限，单据指向最新异常结果；若原单在复验中（RECHECK）则打回待整改（OPEN）且旧整改证据作废。
2. **严重度策略**：LOW/MEDIUM/HIGH/CRITICAL 分别派给维保员/维保班长/维保主管/物业工程负责人，期限 30/7/3/1 天，责任人和期限不接受外部传入。
3. **整改进复验**：维保人员（maintainer）必须同时提交现场照片和修复说明（`POST /api/hazard-ticket/{id}/rectify`），缺任一项报 `RECTIFY_EVIDENCE_REQUIRED`，单据才从 OPEN 进入 RECHECK。
4. **复验关单**：仅物业主管（supervisor）可关单（`POST /api/hazard-ticket/{id}/close`），且必须在 RECHECK 状态；关单后若该设备无其他有效隐患，台账自动恢复 NORMAL。
5. **台账守卫**：设备存在有效隐患时，`POST /api/fire-device/{id}/status` 登记 NORMAL 报 `DEVICE_HAS_OPEN_HAZARD`（409）；所属巡检任务 `POST /api/inspection-task/{id}/complete` 同样被拦截，设备不能从任务清单消失。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
