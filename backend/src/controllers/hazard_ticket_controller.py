from fastapi import Depends, HTTPException

from src.middlewares.error_handler_middleware import to_error_payload, to_http_status
from src.middlewares.rbac_middleware import allow_roles
from src.services.hazard_ticket_service import HazardTicketService
from src.types.domain_error import DomainError

service = HazardTicketService()


def list_hazard_ticket():
    return service.list()


def create_hazard_ticket(payload: dict):
    try:
        return service.create_from_result(payload)
    except DomainError as exc:
        raise HTTPException(status_code=to_http_status(exc.code), detail=to_error_payload(exc))


def rectify_hazard_ticket(ticket_id: int, payload: dict, user=Depends(allow_roles("maintainer", "admin"))):
    try:
        return service.submit_rectification(ticket_id, payload)
    except DomainError as exc:
        raise HTTPException(status_code=to_http_status(exc.code), detail=to_error_payload(exc))


def close_hazard_ticket(ticket_id: int, user=Depends(allow_roles("supervisor", "admin"))):
    try:
        return service.confirm_close(ticket_id)
    except DomainError as exc:
        raise HTTPException(status_code=to_http_status(exc.code), detail=to_error_payload(exc))
