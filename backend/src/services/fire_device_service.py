from src.constants.device_status import DeviceStatus
from src.constants.log_templates import LOG_TEMPLATES
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.types.domain_error import DomainError
from src.utils.formatters import audit_target

# LOG_TEMPLATES["FireDevice"] 下标：2 状态变更 6 登记正常被拦截


class FireDeviceService:
    def __init__(self):
        self.repo = FireDeviceRepository()
        self.ticket_repo = HazardTicketRepository()
        self.result_repo = InspectionResultRepository()

    def list(self):
        return self.repo.find_all()

    def has_open_hazard(self, device_id):
        for ticket in self.ticket_repo.find_all():
            if ticket["rectify_status"] == "CLOSED":
                continue
            result = self.result_repo.find_by_id(ticket["result_id"])
            if result and result["device_id"] == device_id:
                return True
        return False

    def set_status(self, device_id, payload):
        """设备台账与隐患处理绑定：存在有效（未关闭）隐患单时禁止登记正常。"""
        device = self.repo.find_by_id(device_id)
        if device is None:
            raise DomainError("DEVICE_NOT_FOUND")
        status = payload.get("status")
        if status not in DeviceStatus:
            raise DomainError("INVALID_DEVICE_STATUS")
        if status == "NORMAL" and self.has_open_hazard(device_id):
            print(LOG_TEMPLATES["FireDevice"][6], audit_target("FireDevice", device_id))
            raise DomainError("DEVICE_HAS_OPEN_HAZARD")
        device["status"] = status
        self.repo.update(device)
        print(LOG_TEMPLATES["FireDevice"][2], audit_target("FireDevice", device_id))
        return device
