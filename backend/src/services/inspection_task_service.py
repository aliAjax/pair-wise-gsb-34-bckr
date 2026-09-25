from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.services.hazard_ticket_service import HazardTicketService
from src.constants.log_templates import LOG_TEMPLATES
from src.middlewares.audit_log_middleware import record_audit
from src.utils.formatters import audit_target

# 任务终态：复核完成。其余状态都视为待办。
DONE_STATUS = ["REVIEWED"]


class InspectionTaskService:
    def __init__(self):
        self.repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.hazard_service = HazardTicketService()

    def list(self, scope="all"):
        """任务清单：有效隐患未关的任务打上 pinned_by_hazard 标记。

        scope=pending 时，已完成但隐患未关的任务仍保留在清单中，不允许消失。
        """
        rows = self.repo.find_all()
        for row in rows:
            device_ids = {r["device_id"] for r in self.result_repo.find_by_task(row["id"])}
            row["open_hazard_count"] = sum(self.hazard_service.open_hazard_count(d) for d in device_ids)
            row["pinned_by_hazard"] = row["open_hazard_count"] > 0
            if row["pinned_by_hazard"] and row["status"] in DONE_STATUS:
                record_audit(LOG_TEMPLATES["InspectionTask"][4], audit_target("InspectionTask", row["id"]))
        if scope == "pending":
            rows = [row for row in rows if row["status"] not in DONE_STATUS or row["pinned_by_hazard"]]
        return rows
