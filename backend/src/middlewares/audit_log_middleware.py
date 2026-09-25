from src.utils.formatters import utc_now_iso

AUDIT_LOG = []


def record_audit(action, target, actor=None):
    """写操作统一留痕：日志模板来自 constants/log_templates，由 service 层调用。"""
    entry = {
        "action": action,
        "target": target,
        "actor": (actor or {}).get("id", "system"),
        "at": utc_now_iso(),
    }
    AUDIT_LOG.append(entry)
    print("audit", entry["action"], entry["target"], "by", entry["actor"])
    return entry


async def audit_log_middleware(request, call_next):
    print("audit", request.method, request.url.path)
    return await call_next(request)
