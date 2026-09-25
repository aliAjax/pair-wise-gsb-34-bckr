# 严重程度 -> 整改责任人 / 整改期限（天）。
# 严重程度越高，责任人层级越高、期限越短；开单与合并升级时都以此为准。
HAZARD_POLICY = {
    "LOW": {"owner_role": "INSPECTOR", "owner_id": 101, "deadline_days": 30},
    "MEDIUM": {"owner_role": "MAINTENANCE", "owner_id": 201, "deadline_days": 14},
    "HIGH": {"owner_role": "MAINTENANCE", "owner_id": 202, "deadline_days": 7},
    "CRITICAL": {"owner_role": "SUPERVISOR", "owner_id": 301, "deadline_days": 2},
}

SEVERITY_ORDER = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]


def policy_for(severity):
    return HAZARD_POLICY.get(severity, HAZARD_POLICY["MEDIUM"])


def higher_severity(left, right):
    if left not in SEVERITY_ORDER:
        return right
    if right not in SEVERITY_ORDER:
        return left
    return left if SEVERITY_ORDER.index(left) >= SEVERITY_ORDER.index(right) else right
