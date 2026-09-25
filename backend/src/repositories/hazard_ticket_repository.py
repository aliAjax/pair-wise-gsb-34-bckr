from src.seed import seed
from src.constants.rectify_status import OPEN_RECTIFY_STATUS


class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]

    def get(self, ticket_id):
        for row in seed["hazardTicket"]:
            if row["id"] == ticket_id:
                return row
        return None

    def find_open_by_device_item(self, device_id, item_code):
        """同一设备同一检查项的有效（未关闭）隐患单，用于合并。"""
        for row in seed["hazardTicket"]:
            if (
                row["device_id"] == device_id
                and row["item_code"] == item_code
                and row["rectify_status"] in OPEN_RECTIFY_STATUS
            ):
                return row
        return None

    def find_open_by_device(self, device_id):
        return [
            row
            for row in seed["hazardTicket"]
            if row["device_id"] == device_id and row["rectify_status"] in OPEN_RECTIFY_STATUS
        ]

    def save(self, ticket):
        existing = self.get(ticket["id"])
        if existing is None:
            seed["hazardTicket"].append(ticket)
        return ticket

    def next_id(self):
        return max([row["id"] for row in seed["hazardTicket"]] + [0]) + 1
