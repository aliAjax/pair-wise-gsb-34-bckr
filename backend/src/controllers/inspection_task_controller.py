from fastapi import HTTPException

from src.middlewares.error_handler_middleware import to_error_payload, to_http_status
from src.services.inspection_task_service import InspectionTaskService
from src.types.domain_error import DomainError

service = InspectionTaskService()


def list_inspection_task():
    return service.list()


def complete_inspection_task(task_id: int):
    try:
        return service.complete(task_id)
    except DomainError as exc:
        raise HTTPException(status_code=to_http_status(exc.code), detail=to_error_payload(exc))
