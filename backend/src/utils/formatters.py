from datetime import datetime, timedelta, timezone


def audit_target(kind, id):
    return f"{kind}#{id}"


def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()


def deadline_from_days(days):
    return (datetime.now(timezone.utc) + timedelta(days=days)).date().isoformat()
