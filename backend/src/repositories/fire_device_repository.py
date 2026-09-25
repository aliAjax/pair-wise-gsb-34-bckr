from src.seed import seed


class FireDeviceRepository:
    def find_all(self):
        return seed["fireDevice"]

    def find_by_id(self, device_id):
        for row in seed["fireDevice"]:
            if row["id"] == device_id:
                return row
        return None

    def update(self, row):
        for index, existing in enumerate(seed["fireDevice"]):
            if existing["id"] == row["id"]:
                seed["fireDevice"][index] = row
                return row
        return None
