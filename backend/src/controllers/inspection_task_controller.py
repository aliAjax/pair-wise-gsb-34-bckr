from src.services.inspection_task_service import InspectionTaskService

service = InspectionTaskService()


def list_inspection_task(scope: str = "all"):
    return service.list(scope)
