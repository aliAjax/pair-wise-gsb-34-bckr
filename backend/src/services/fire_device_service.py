from src.repositories.fire_device_repository import FireDeviceRepository
from src.services.hazard_ticket_service import HazardTicketService
from src.constants.device_status import DeviceStatus
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.middlewares.error_handler_middleware import BizError
from src.middlewares.audit_log_middleware import record_audit
from src.utils.formatters import audit_target


class FireDeviceService:
    def __init__(self):
        self.repo = FireDeviceRepository()
        self.hazard_service = HazardTicketService()

    def list(self):
        """设备台账：每台设备附带未关闭隐患数，台账状态与隐患处理绑定。"""
        rows = self.repo.find_all()
        for row in rows:
            row["open_hazard_count"] = self.hazard_service.open_hazard_count(row["id"])
        return rows

    def update_status(self, device_id, status, actor=None):
        """设备状态登记：存在有效隐患未关闭时，禁止登记为正常。"""
        device = self.repo.get(device_id)
        if device is None:
            raise BizError(ERROR_CODES["DEVICE_NOT_FOUND"])
        if status not in DeviceStatus:
            raise BizError(ERROR_CODES["VALIDATION_FAILED"])
        if status == "NORMAL" and self.hazard_service.has_open_hazard(device_id):
            record_audit(LOG_TEMPLATES["FireDevice"][4], audit_target("FireDevice", device_id), actor)
            raise BizError(ERROR_CODES["DEVICE_BLOCKED_BY_HAZARD"])
        device["status"] = status
        self.repo.save(device)
        record_audit(LOG_TEMPLATES["FireDevice"][2], audit_target("FireDevice", device_id), actor)
        device["open_hazard_count"] = self.hazard_service.open_hazard_count(device_id)
        return device
