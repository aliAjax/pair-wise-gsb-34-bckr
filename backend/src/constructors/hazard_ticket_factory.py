def create_hazard_ticket_dto(**overrides):
    row = {
        "id": 1,
        "result_id": 1,
        "device_id": 1,
        "item_code": "PRESSURE",
        "severity": "MEDIUM",
        "owner_id": 201,
        "deadline": "",
        "rectify_status": "OPEN",
        "rectify_note": "",
        "rectify_photo_url": "",
        "merged_result_ids": [],
        "rectified_at": "",
        "recheck_note": "",
        "closed_at": "",
    }
    row.update(overrides)
    return row
