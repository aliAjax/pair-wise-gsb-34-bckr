from src.seed import seed


class FireDeviceRepository:
    def find_all(self):
        return seed["fireDevice"]

    def get(self, device_id):
        for row in seed["fireDevice"]:
            if row["id"] == device_id:
                return row
        return None

    def save(self, device):
        existing = self.get(device["id"])
        if existing is None:
            seed["fireDevice"].append(device)
        return device
