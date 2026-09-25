from fastapi import Request

from src.types.domain_error import DomainError


def allow_roles(*roles):
    """RBAC 依赖：角色不在允许列表内时拒绝，由全局 DomainError 处理器转成 403。"""
    def dependency(request: Request):
        user = getattr(request.state, "user", None) or {}
        if user.get("role") not in roles:
            raise DomainError("RBAC_DENIED")
        return user
    return dependency
