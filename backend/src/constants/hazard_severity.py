HazardSeverity = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

# 严重程度决定责任人和整改期限：级别越高，责任人层级越高、期限越短。
SEVERITY_POLICY = {
  "LOW": {"owner_id": 101, "deadline_days": 30},
  "MEDIUM": {"owner_id": 201, "deadline_days": 7},
  "HIGH": {"owner_id": 301, "deadline_days": 3},
  "CRITICAL": {"owner_id": 401, "deadline_days": 1}
}

# 合并隐患单时用于比较严重度高低。
SEVERITY_ORDER = {"LOW": 0, "MEDIUM": 1, "HIGH": 2, "CRITICAL": 3}
