LOG_TEMPLATES = {
  "Building": [
    "Building.create",
    "Building.update",
    "Building.status",
    "Building.export"
  ],
  "FireDevice": [
    "FireDevice.create",
    "FireDevice.update",
    "FireDevice.status",
    "FireDevice.export",
    "FireDevice.status_blocked_by_hazard",
    "FireDevice.status_restored_after_close"
  ],
  "InspectionTask": [
    "InspectionTask.create",
    "InspectionTask.update",
    "InspectionTask.status",
    "InspectionTask.export",
    "InspectionTask.pinned_by_open_hazard"
  ],
  "InspectionResult": [
    "InspectionResult.create",
    "InspectionResult.update",
    "InspectionResult.status",
    "InspectionResult.export",
    "InspectionResult.fail_trigger_hazard"
  ],
  "HazardTicket": [
    "HazardTicket.create",
    "HazardTicket.update",
    "HazardTicket.status",
    "HazardTicket.export",
    "HazardTicket.merge_same_device_item",
    "HazardTicket.rectify_submit",
    "HazardTicket.recheck_close",
    "HazardTicket.recheck_reject"
  ]
}
