from fastapi import HTTPException

from src.middlewares.error_handler_middleware import to_error_payload, to_http_status
from src.services.fire_device_service import FireDeviceService
from src.types.domain_error import DomainError

service = FireDeviceService()


def list_fire_device():
    return service.list()


def update_fire_device_status(device_id: int, payload: dict):
    try:
        return service.set_status(device_id, payload)
    except DomainError as exc:
        raise HTTPException(status_code=to_http_status(exc.code), detail=to_error_payload(exc))
