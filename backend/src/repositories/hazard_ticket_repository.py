from src.seed import seed


class HazardTicketRepository:
    def find_all(self):
        return seed["hazardTicket"]

    def find_by_id(self, ticket_id):
        for row in seed["hazardTicket"]:
            if row["id"] == ticket_id:
                return row
        return None

    def next_id(self):
        return max((row["id"] for row in seed["hazardTicket"]), default=0) + 1

    def insert(self, row):
        seed["hazardTicket"].append(row)
        return row

    def update(self, row):
        for index, existing in enumerate(seed["hazardTicket"]):
            if existing["id"] == row["id"]:
                seed["hazardTicket"][index] = row
                return row
        return None
