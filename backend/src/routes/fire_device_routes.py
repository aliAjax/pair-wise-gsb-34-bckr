from fastapi import APIRouter

from src.controllers.fire_device_controller import list_fire_device, update_fire_device_status

router = APIRouter(prefix="/api/fire-device", tags=["FireDevice"])
router.get("")(list_fire_device)
router.post("/{device_id}/status")(update_fire_device_status)
