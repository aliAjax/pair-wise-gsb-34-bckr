from fastapi import APIRouter

from src.controllers.inspection_task_controller import complete_inspection_task, list_inspection_task

router = APIRouter(prefix="/api/inspection-task", tags=["InspectionTask"])
router.get("")(list_inspection_task)
router.post("/{task_id}/complete")(complete_inspection_task)
