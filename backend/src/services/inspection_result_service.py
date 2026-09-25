from src.repositories.inspection_result_repository import InspectionResultRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.services.hazard_ticket_service import HazardTicketService
from src.constants.result_status import ResultStatus
from src.constants.hazard_severity import HazardSeverity
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constructors.inspection_result_factory import create_inspection_result_dto
from src.middlewares.error_handler_middleware import BizError
from src.middlewares.audit_log_middleware import record_audit
from src.utils.formatters import audit_target


class InspectionResultService:
    def __init__(self):
        self.repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()
        self.task_repo = InspectionTaskRepository()
        self.hazard_service = HazardTicketService()

    def list(self):
        return self.repo.find_all()

    def create(self, payload, actor=None):
        """录入检查项结果：不合格即触发隐患单（同设备同检查项自动合并）。"""
        device = self.device_repo.get(payload.get("device_id"))
        if device is None:
            raise BizError(ERROR_CODES["DEVICE_NOT_FOUND"])
        task = self.task_repo.get(payload.get("task_id"))
        if task is None:
            raise BizError(ERROR_CODES["TASK_NOT_FOUND"])
        result_status = payload.get("result_status", "PASS")
        if result_status not in ResultStatus:
            raise BizError(ERROR_CODES["VALIDATION_FAILED"])
        severity = payload.get("severity", "MEDIUM")
        if result_status == "FAIL" and severity not in HazardSeverity:
            raise BizError(ERROR_CODES["VALIDATION_FAILED"])

        result = create_inspection_result_dto(
            id=self.repo.next_id(),
            task_id=task["id"],
            device_id=device["id"],
            item_code=payload.get("item_code", ""),
            result_status=result_status,
            measured_value=payload.get("measured_value", ""),
            photo_url=payload.get("photo_url", ""),
            note=payload.get("note", ""),
        )
        self.repo.save(result)
        record_audit(LOG_TEMPLATES["InspectionResult"][0], audit_target("InspectionResult", result["id"]), actor)

        hazard = None
        hazard_created = False
        if result["result_status"] == "FAIL":
            record_audit(LOG_TEMPLATES["InspectionResult"][4], audit_target("InspectionResult", result["id"]), actor)
            hazard, hazard_created = self.hazard_service.merge_or_create(result, severity)
        return {"result": result, "hazard": hazard, "hazard_created": hazard_created}
