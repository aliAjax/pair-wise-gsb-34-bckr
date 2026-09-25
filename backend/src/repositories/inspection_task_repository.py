from src.seed import seed


class InspectionTaskRepository:
    def find_all(self):
        return seed["inspectionTask"]

    def find_by_id(self, task_id):
        for row in seed["inspectionTask"]:
            if row["id"] == task_id:
                return row
        return None

    def update(self, row):
        for index, existing in enumerate(seed["inspectionTask"]):
            if existing["id"] == row["id"]:
                seed["inspectionTask"][index] = row
                return row
        return None
