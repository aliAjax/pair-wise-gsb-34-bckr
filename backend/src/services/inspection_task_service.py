from src.constants.log_templates import LOG_TEMPLATES
from src.repositories.fire_device_repository import FireDeviceRepository
from src.repositories.inspection_task_repository import InspectionTaskRepository
from src.repositories.inspection_result_repository import InspectionResultRepository
from src.services.fire_device_service import FireDeviceService
from src.types.domain_error import DomainError
from src.utils.formatters import audit_target, now_iso

# LOG_TEMPLATES["InspectionTask"] 下标：4 完成 5 完成被拦截


class InspectionTaskService:
    def __init__(self):
        self.repo = InspectionTaskRepository()
        self.result_repo = InspectionResultRepository()
        self.device_repo = FireDeviceRepository()
        self.device_service = FireDeviceService()

    def list(self):
        return self.repo.find_all()

    def complete(self, task_id):
        """任务内任何设备存在有效隐患单时，任务不能完成，设备不能从任务清单消失。"""
        task = self.repo.find_by_id(task_id)
        if task is None:
            raise DomainError("TASK_NOT_FOUND")
        device_ids = {row["device_id"] for row in self.result_repo.find_by_task(task_id)}
        for device_id in device_ids:
            if self.device_service.has_open_hazard(device_id):
                print(LOG_TEMPLATES["InspectionTask"][5], audit_target("InspectionTask", task_id))
                raise DomainError("DEVICE_HAS_OPEN_HAZARD")
        task["status"] = "REVIEWED"
        task["finished_at"] = now_iso()
        self.repo.update(task)
        print(LOG_TEMPLATES["InspectionTask"][4], audit_target("InspectionTask", task_id))
        return task
