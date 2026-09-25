from pydantic import BaseModel


class HazardTicket(BaseModel):
    id: int | float
    result_id: int | float
    device_id: int | float
    item_code: str
    severity: str
    owner_id: int | float
    deadline: str
    rectify_status: str
    rectify_note: str
    rectify_photo_url: str
    merged_result_ids: list = []
    rectified_at: str = ""
    recheck_note: str = ""
    closed_at: str = ""
