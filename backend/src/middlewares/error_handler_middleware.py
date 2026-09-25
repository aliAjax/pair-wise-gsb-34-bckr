from src.constants.error_messages import ERROR_MESSAGES


class BizError(Exception):
    """业务异常：code 取自 constants/error_codes，message 取自 constants/error_messages。"""

    def __init__(self, code, message=None):
        self.code = code
        self.message = message or ERROR_MESSAGES.get(code, code)
        super().__init__(self.message)


def to_error_payload(exc):
    return {
        "code": getattr(exc, "code", "INTERNAL_ERROR"),
        "message": getattr(exc, "message", str(exc)),
    }


def http_status_for(code):
    if code in ("RBAC_DENIED", "SUPERVISOR_REQUIRED", "AUTH_REQUIRED"):
        return 403
    if code.endswith("NOT_FOUND"):
        return 404
    if code in ("DEVICE_BLOCKED_BY_HAZARD", "INVALID_TICKET_STATE"):
        return 409
    return 400
