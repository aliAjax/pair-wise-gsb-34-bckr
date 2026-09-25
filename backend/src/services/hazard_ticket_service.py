from src.repositories.hazard_ticket_repository import HazardTicketRepository
from src.repositories.fire_device_repository import FireDeviceRepository
from src.constants.hazard_policy import policy_for, higher_severity
from src.constants.rectify_status import RectifyStatus
from src.constants.device_status import DeviceStatus
from src.constants.error_codes import ERROR_CODES
from src.constants.log_templates import LOG_TEMPLATES
from src.constructors.hazard_ticket_factory import create_hazard_ticket_dto
from src.middlewares.error_handler_middleware import BizError
from src.middlewares.audit_log_middleware import record_audit
from src.utils.formatters import audit_target, utc_now_iso, deadline_from_days


class HazardTicketService:
    """隐患整改单：与设备台账、巡检结果联动，闭环状态机 OPEN -> RECHECK -> CLOSED。"""

    def __init__(self):
        self.repo = HazardTicketRepository()
        self.device_repo = FireDeviceRepository()

    def list(self):
        return self.repo.find_all()

    def merge_or_create(self, result, severity):
        """不合格结果触发隐患单：同一设备同一检查项只保留一张有效隐患单。

        已存在有效单 -> 合并（严重程度取更高者，责任人与期限按策略重算，结果并入 merged_result_ids）；
        不存在 -> 按严重程度策略派单（责任人 + 期限）。两种情况都会把设备锁定为 ABNORMAL。
        """
        device_id = result["device_id"]
        item_code = result["item_code"]
        existing = self.repo.find_open_by_device_item(device_id, item_code)
        if existing is not None:
            merged_severity = higher_severity(existing["severity"], severity)
            if merged_severity != existing["severity"]:
                policy = policy_for(merged_severity)
                existing["severity"] = merged_severity
                existing["owner_id"] = policy["owner_id"]
                existing["deadline"] = deadline_from_days(policy["deadline_days"])
            if result["id"] not in existing["merged_result_ids"]:
                existing["merged_result_ids"].append(result["id"])
            self.repo.save(existing)
            record_audit(LOG_TEMPLATES["HazardTicket"][4], audit_target("HazardTicket", existing["id"]))
            self._lock_device(device_id)
            return existing, False

        policy = policy_for(severity)
        ticket = create_hazard_ticket_dto(
            id=self.repo.next_id(),
            result_id=result["id"],
            device_id=device_id,
            item_code=item_code,
            severity=severity,
            owner_id=policy["owner_id"],
            deadline=deadline_from_days(policy["deadline_days"]),
            rectify_status="OPEN",
            merged_result_ids=[result["id"]],
        )
        self.repo.save(ticket)
        record_audit(LOG_TEMPLATES["HazardTicket"][0], audit_target("HazardTicket", ticket["id"]))
        self._lock_device(device_id)
        return ticket, True

    def submit_rectify(self, ticket_id, rectify_note, rectify_photo_url, actor=None):
        """维保提交整改：必须带现场照片和修复说明，才允许进入复验。"""
        ticket = self.repo.get(ticket_id)
        if ticket is None:
            raise BizError(ERROR_CODES["TICKET_NOT_FOUND"])
        if ticket["rectify_status"] != "OPEN":
            raise BizError(ERROR_CODES["INVALID_TICKET_STATE"])
        if not (rectify_note or "").strip() or not (rectify_photo_url or "").strip():
            raise BizError(ERROR_CODES["RECTIFY_EVIDENCE_REQUIRED"])
        ticket["rectify_note"] = rectify_note.strip()
        ticket["rectify_photo_url"] = rectify_photo_url.strip()
        ticket["rectify_status"] = "RECHECK"
        ticket["rectified_at"] = utc_now_iso()
        self.repo.save(ticket)
        record_audit(LOG_TEMPLATES["HazardTicket"][5], audit_target("HazardTicket", ticket_id), actor)
        return ticket

    def confirm_close(self, ticket_id, confirm, recheck_note="", actor=None):
        """物业主管复验：确认设备恢复才能关单；驳回则退回整改。"""
        if (actor or {}).get("role") not in ("SUPERVISOR", "admin"):
            raise BizError(ERROR_CODES["SUPERVISOR_REQUIRED"])
        ticket = self.repo.get(ticket_id)
        if ticket is None:
            raise BizError(ERROR_CODES["TICKET_NOT_FOUND"])
        if ticket["rectify_status"] != "RECHECK":
            raise BizError(ERROR_CODES["INVALID_TICKET_STATE"])
        ticket["recheck_note"] = (recheck_note or "").strip()
        if confirm:
            ticket["rectify_status"] = "CLOSED"
            ticket["closed_at"] = utc_now_iso()
            self.repo.save(ticket)
            record_audit(LOG_TEMPLATES["HazardTicket"][6], audit_target("HazardTicket", ticket_id), actor)
            self._release_device_if_clear(ticket["device_id"], actor)
        else:
            ticket["rectify_status"] = "OPEN"
            self.repo.save(ticket)
            record_audit(LOG_TEMPLATES["HazardTicket"][7], audit_target("HazardTicket", ticket_id), actor)
        return ticket

    def has_open_hazard(self, device_id):
        return len(self.repo.find_open_by_device(device_id)) > 0

    def open_hazard_count(self, device_id):
        return len(self.repo.find_open_by_device(device_id))

    def _lock_device(self, device_id):
        device = self.device_repo.get(device_id)
        if device is not None and device["status"] == "NORMAL":
            device["status"] = "ABNORMAL"
            self.device_repo.save(device)
            record_audit(LOG_TEMPLATES["FireDevice"][2], audit_target("FireDevice", device_id))

    def _release_device_if_clear(self, device_id, actor=None):
        """关单后设备无其他有效隐患时才允许恢复正常。"""
        if self.has_open_hazard(device_id):
            return
        device = self.device_repo.get(device_id)
        if device is not None and device["status"] == "ABNORMAL":
            device["status"] = "NORMAL"
            self.device_repo.save(device)
            record_audit(LOG_TEMPLATES["FireDevice"][5], audit_target("FireDevice", device_id), actor)
