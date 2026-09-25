from src.constants.error_codes import ERROR_CODES
from src.middlewares.error_handler_middleware import BizError


def allow_roles(*roles):
    """RBAC 校验：request.state.user 由 auth_middleware 注入，admin 放行。"""

    def checker(request):
        user = getattr(request.state, "user", None) or {}
        role = user.get("role")
        if role != "admin" and role not in roles:
            raise BizError(ERROR_CODES["RBAC_DENIED"])
        return True

    return checker
