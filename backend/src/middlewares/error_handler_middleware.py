from src.constants.error_messages import ERROR_MESSAGES

HTTP_STATUS_BY_CODE = {
    "AUTH_REQUIRED": 401,
    "RBAC_DENIED": 403,
    "VALIDATION_FAILED": 400,
    "RESULT_NOT_ABNORMAL": 400,
    "RECTIFY_EVIDENCE_REQUIRED": 400,
    "INVALID_DEVICE_STATUS": 400,
    "TICKET_NOT_FOUND": 404,
    "RESULT_NOT_FOUND": 404,
    "DEVICE_NOT_FOUND": 404,
    "TASK_NOT_FOUND": 404,
    "RECTIFY_STATUS_FORBIDDEN": 409,
    "DEVICE_HAS_OPEN_HAZARD": 409
}


def to_error_payload(exc):
    code = getattr(exc, "code", "INTERNAL_ERROR")
    return {"code": code, "message": ERROR_MESSAGES.get(code, str(exc))}


def to_http_status(code):
    return HTTP_STATUS_BY_CODE.get(code, 400)
