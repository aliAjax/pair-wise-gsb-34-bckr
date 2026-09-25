from fastapi import Request
from src.services.hazard_ticket_service import HazardTicketService
from src.middlewares.rbac_middleware import allow_roles
from src.middlewares.error_handler_middleware import BizError
from src.constants.error_codes import ERROR_CODES

service = HazardTicketService()


def list_hazard_ticket():
    return service.list()


def rectify_hazard_ticket(ticket_id: int, payload: dict, request: Request):
    """维保提交整改：现场照片 + 修复说明齐全才进入复验。"""
    allow_roles("MAINTENANCE", "SUPERVISOR")(request)
    try:
        return service.submit_rectify(
            ticket_id,
            payload.get("rectify_note", ""),
            payload.get("rectify_photo_url", ""),
            request.state.user,
        )
    except BizError:
        raise
    except Exception as exc:
        raise BizError(ERROR_CODES["VALIDATION_FAILED"]) from exc


def close_hazard_ticket(ticket_id: int, payload: dict, request: Request):
    """物业主管复验关单：确认设备恢复才允许关闭。"""
    allow_roles("SUPERVISOR")(request)
    try:
        return service.confirm_close(
            ticket_id,
            bool(payload.get("confirm", False)),
            payload.get("recheck_note", ""),
            request.state.user,
        )
    except BizError:
        raise
    except Exception as exc:
        raise BizError(ERROR_CODES["VALIDATION_FAILED"]) from exc
