from src.seed import seed


class InspectionResultRepository:
    def find_all(self):
        return seed["inspectionResult"]

    def get(self, result_id):
        for row in seed["inspectionResult"]:
            if row["id"] == result_id:
                return row
        return None

    def find_by_task(self, task_id):
        return [row for row in seed["inspectionResult"] if row["task_id"] == task_id]

    def save(self, result):
        existing = self.get(result["id"])
        if existing is None:
            seed["inspectionResult"].append(result)
        return result

    def next_id(self):
        return max([row["id"] for row in seed["inspectionResult"]] + [0]) + 1
