from fastapi import Request
from src.services.inspection_result_service import InspectionResultService
from src.middlewares.rbac_middleware import allow_roles
from src.middlewares.error_handler_middleware import BizError
from src.constants.error_codes import ERROR_CODES

service = InspectionResultService()


def list_inspection_result():
    return service.list()


def create_inspection_result(payload: dict, request: Request):
    """录入检查项结果：不合格项自动生成/合并隐患单并锁定设备。"""
    allow_roles("INSPECTOR", "SUPERVISOR")(request)
    try:
        return service.create(payload, request.state.user)
    except BizError:
        raise
    except Exception as exc:
        raise BizError(ERROR_CODES["VALIDATION_FAILED"]) from exc
