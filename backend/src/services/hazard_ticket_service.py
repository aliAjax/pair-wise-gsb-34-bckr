from src.constants.hazard_severity import HazardSeverity, SEVERITY_POLICY, SEVERITY_ORDER
from src.constants.log_templates import LOG_TEMPLATES
from src.constructors.hazard_ticket_factory import build_ticket_from_result, create_hazard_ticket_response
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.types.domain_error import DomainError
from src.utils.formatters import audit_target, deadline_iso, now_iso

# LOG_TEMPLATES["HazardTicket"] 下标：0 创建 4 合并 5 整改 6 关闭
# LOG_TEMPLATES["FireDevice"] 下标：4 转入隐患 5 隐患消除


class HazardTicketService:
    def __init__(self):
        self.repo = HazardTicketRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()

    def list(self):
        return self.repo.find_all()

    def _find_open_ticket_for(self, device_id, item_code):
        """同一设备同一检查项只保留一张有效（未关闭）隐患单。"""
        for ticket in self.repo.find_all():
            if ticket["rectify_status"] == "CLOSED":
                continue
            result = self.result_repo.find_by_id(ticket["result_id"])
            if result and result["device_id"] == device_id and result["item_code"] == item_code:
                return ticket
        return None

    def _open_tickets_of_device(self, device_id):
        open_tickets = []
        for ticket in self.repo.find_all():
            if ticket["rectify_status"] == "CLOSED":
                continue
            result = self.result_repo.find_by_id(ticket["result_id"])
            if result and result["device_id"] == device_id:
                open_tickets.append(ticket)
        return open_tickets

    def create_from_result(self, payload):
        result_id = payload.get("result_id")
        severity = payload.get("severity")
        result = self.result_repo.find_by_id(result_id)
        if result is None:
            raise DomainError("RESULT_NOT_FOUND")
        if result["result_status"] != "FAIL":
            raise DomainError("RESULT_NOT_ABNORMAL")
        if severity not in HazardSeverity:
            raise DomainError("VALIDATION_FAILED")

        existing = self._find_open_ticket_for(result["device_id"], result["item_code"])
        if existing is not None:
            merged = self._merge_into(existing, result, severity)
            print(LOG_TEMPLATES["HazardTicket"][4], audit_target("HazardTicket", merged["id"]))
            return create_hazard_ticket_response(merged, True)

        ticket = build_ticket_from_result(self.repo.next_id(), result, severity)
        self.repo.insert(ticket)
        self._mark_device_hazard_open(result["device_id"])
        print(LOG_TEMPLATES["HazardTicket"][0], audit_target("HazardTicket", ticket["id"]))
        return create_hazard_ticket_response(ticket, False)

    def _merge_into(self, ticket, result, severity):
        """合并：指向最新异常结果；严重度升级时按策略重算责任人和期限；
        复验中的单据被打回待整改，旧的整改证据作废，需重新提交。"""
        ticket["result_id"] = result["id"]
        if SEVERITY_ORDER[severity] > SEVERITY_ORDER[ticket["severity"]]:
            ticket["severity"] = severity
            policy = SEVERITY_POLICY[severity]
            ticket["owner_id"] = policy["owner_id"]
            ticket["deadline"] = deadline_iso(policy["deadline_days"])
        if ticket["rectify_status"] == "RECHECK":
            ticket["rectify_status"] = "OPEN"
            ticket["rectify_note"] = ""
            ticket["rectify_photo_url"] = ""
        self.repo.update(ticket)
        self._mark_device_hazard_open(result["device_id"])
        return ticket

    def submit_rectification(self, ticket_id, payload):
        """维保人员提交现场照片和修复说明后，隐患单才进入复验。"""
        ticket = self.repo.find_by_id(ticket_id)
        if ticket is None:
            raise DomainError("TICKET_NOT_FOUND")
        if ticket["rectify_status"] != "OPEN":
            raise DomainError("RECTIFY_STATUS_FORBIDDEN")
        photo_url = (payload.get("photo_url") or "").strip()
        rectify_note = (payload.get("rectify_note") or "").strip()
        if not photo_url or not rectify_note:
            raise DomainError("RECTIFY_EVIDENCE_REQUIRED")
        ticket["rectify_photo_url"] = photo_url
        ticket["rectify_note"] = rectify_note
        ticket["rectify_status"] = "RECHECK"
        self.repo.update(ticket)
        print(LOG_TEMPLATES["HazardTicket"][5], audit_target("HazardTicket", ticket["id"]))
        return ticket

    def confirm_close(self, ticket_id):
        """物业主管确认设备恢复后才能关单；关单后设备无其他有效隐患则台账恢复正常。"""
        ticket = self.repo.find_by_id(ticket_id)
        if ticket is None:
            raise DomainError("TICKET_NOT_FOUND")
        if ticket["rectify_status"] != "RECHECK":
            raise DomainError("RECTIFY_STATUS_FORBIDDEN")
        ticket["rectify_status"] = "CLOSED"
        ticket["closed_at"] = now_iso()
        self.repo.update(ticket)
        print(LOG_TEMPLATES["HazardTicket"][6], audit_target("HazardTicket", ticket["id"]))

        result = self.result_repo.find_by_id(ticket["result_id"])
        if result and not self._open_tickets_of_device(result["device_id"]):
            device = self.device_repo.find_by_id(result["device_id"])
            if device and device["status"] == "HAZARD_OPEN":
                device["status"] = "NORMAL"
                self.device_repo.update(device)
                print(LOG_TEMPLATES["FireDevice"][5], audit_target("FireDevice", device["id"]))
        return ticket

    def _mark_device_hazard_open(self, device_id):
        device = self.device_repo.find_by_id(device_id)
        if device and device["status"] != "HAZARD_OPEN":
            device["status"] = "HAZARD_OPEN"
            self.device_repo.update(device)
            print(LOG_TEMPLATES["FireDevice"][4], audit_target("FireDevice", device["id"]))
