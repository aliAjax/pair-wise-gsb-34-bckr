from src.seed import seed


class InspectionTaskRepository:
    def find_all(self):
        return seed["inspectionTask"]

    def get(self, task_id):
        for row in seed["inspectionTask"]:
            if row["id"] == task_id:
                return row
        return None

    def save(self, task):
        existing = self.get(task["id"])
        if existing is None:
            seed["inspectionTask"].append(task)
        return task
