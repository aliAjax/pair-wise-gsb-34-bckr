from src.constants.hazard_severity import SEVERITY_POLICY
from src.utils.formatters import deadline_iso


def create_hazard_ticket_dto(**overrides):
    row = {"id":1,"result_id":1,"severity":"LOW","owner_id":101,"deadline":"2026-06-11T09:00:00Z","rectify_status":"OPEN","rectify_note":"","rectify_photo_url":"","closed_at":""}
    row.update(overrides)
    return row


def build_ticket_from_result(ticket_id, result, severity):
    """新隐患单：责任人和期限完全由严重程度策略决定，不接受外部传入。"""
    policy = SEVERITY_POLICY[severity]
    return {
        "id": ticket_id,
        "result_id": result["id"],
        "severity": severity,
        "owner_id": policy["owner_id"],
        "deadline": deadline_iso(policy["deadline_days"]),
        "rectify_status": "OPEN",
        "rectify_note": "",
        "rectify_photo_url": "",
        "closed_at": ""
    }


def create_hazard_ticket_response(ticket, merged):
    row = dict(ticket)
    row["merged"] = merged
    return row
