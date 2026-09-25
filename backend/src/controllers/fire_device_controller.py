from fastapi import Request
from src.services.fire_device_service import FireDeviceService
from src.middlewares.rbac_middleware import allow_roles
from src.middlewares.error_handler_middleware import BizError
from src.constants.error_codes import ERROR_CODES

service = FireDeviceService()


def list_fire_device():
    return service.list()


def update_fire_device_status(device_id: int, payload: dict, request: Request):
    """设备状态登记：有效隐患未关闭时登记正常会被拒绝。"""
    allow_roles("INSPECTOR", "MAINTENANCE", "SUPERVISOR")(request)
    try:
        return service.update_status(device_id, payload.get("status", ""), request.state.user)
    except BizError:
        raise
    except Exception as exc:
        raise BizError(ERROR_CODES["VALIDATION_FAILED"]) from exc
