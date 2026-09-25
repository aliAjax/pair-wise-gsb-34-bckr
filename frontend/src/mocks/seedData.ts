// 与后端 src/seed.py 保持一致的本地演示数据（离线评审时的兜底数据源）。
export const mockData = {
  "building": [
    {
      "id": 1,
      "name": "A 座研发楼",
      "campus": "东区园区",
      "floor_count": "12",
      "fire_grade": "一级",
      "manager_id": 301,
      "address_code": "CAMPUS-E-A"
    },
    {
      "id": 2,
      "name": "B 座公寓楼",
      "campus": "东区园区",
      "floor_count": "18",
      "fire_grade": "一级",
      "manager_id": 301,
      "address_code": "CAMPUS-E-B"
    },
    {
      "id": 3,
      "name": "C 座食堂",
      "campus": "西区园区",
      "floor_count": "3",
      "fire_grade": "二级",
      "manager_id": 302,
      "address_code": "CAMPUS-W-C"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "EXT-A1-001",
      "device_type": "EXTINGUISHER",
      "floor": "1F",
      "location_desc": "A 座 1 层大堂东侧",
      "install_date": "2025-03-11T09:00:00Z",
      "status": "ABNORMAL",
      "next_maintenance_at": "2026-10-11T09:00:00Z",
      "open_hazard_count": 1
    },
    {
      "id": 2,
      "building_id": 1,
      "device_code": "HYD-A2-003",
      "device_type": "HYDRANT",
      "floor": "2F",
      "location_desc": "A 座 2 层走廊北端",
      "install_date": "2025-04-12T09:00:00Z",
      "status": "ABNORMAL",
      "next_maintenance_at": "2026-10-12T09:00:00Z",
      "open_hazard_count": 1
    },
    {
      "id": 3,
      "building_id": 2,
      "device_code": "SMK-B3-012",
      "device_type": "SMOKE_DETECTOR",
      "floor": "3F",
      "location_desc": "B 座 3 层电梯厅",
      "install_date": "2025-05-13T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-11-13T09:00:00Z",
      "open_hazard_count": 0
    },
    {
      "id": 4,
      "building_id": 3,
      "device_code": "SPR-C1-002",
      "device_type": "SPRINKLER",
      "floor": "1F",
      "location_desc": "C 座 1 层后厨",
      "install_date": "2025-06-14T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-12-14T09:00:00Z",
      "open_hazard_count": 0
    },
    {
      "id": 5,
      "building_id": 2,
      "device_code": "EXIT-B1-006",
      "device_type": "EXIT_LIGHT",
      "floor": "1F",
      "location_desc": "B 座 1 层安全出口",
      "install_date": "2025-07-15T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-12-15T09:00:00Z",
      "open_hazard_count": 0
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 101,
      "plan_date": "2026-09-20T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "IN_PROGRESS",
      "checklist_version": "v2026.09",
      "finished_at": "",
      "open_hazard_count": 1,
      "pinned_by_hazard": true
    },
    {
      "id": 2,
      "building_id": 1,
      "inspector_id": 102,
      "plan_date": "2026-09-21T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "SUBMITTED",
      "checklist_version": "v2026.09",
      "finished_at": "2026-09-21T17:00:00Z",
      "open_hazard_count": 1,
      "pinned_by_hazard": true
    },
    {
      "id": 3,
      "building_id": 2,
      "inspector_id": 101,
      "plan_date": "2026-09-22T09:00:00Z",
      "task_type": "QUARTERLY",
      "status": "REVIEWED",
      "checklist_version": "v2026.09",
      "finished_at": "2026-09-22T16:00:00Z",
      "open_hazard_count": 0,
      "pinned_by_hazard": false
    },
    {
      "id": 4,
      "building_id": 3,
      "inspector_id": 103,
      "plan_date": "2026-09-23T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "PLANNED",
      "checklist_version": "v2026.09",
      "finished_at": "",
      "open_hazard_count": 0,
      "pinned_by_hazard": false
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 1,
      "device_id": 1,
      "item_code": "PRESSURE",
      "result_status": "FAIL",
      "measured_value": "0.4MPa",
      "photo_url": "/mock/result-1.jpg",
      "note": "灭火器压力不足"
    },
    {
      "id": 2,
      "task_id": 1,
      "device_id": 1,
      "item_code": "PRESSURE",
      "result_status": "FAIL",
      "measured_value": "0.3MPa",
      "photo_url": "/mock/result-2.jpg",
      "note": "复检压力仍不足，并入同一隐患单"
    },
    {
      "id": 3,
      "task_id": 2,
      "device_id": 2,
      "item_code": "VALVE",
      "result_status": "FAIL",
      "measured_value": "渗漏",
      "photo_url": "/mock/result-3.jpg",
      "note": "消火栓阀门渗漏"
    },
    {
      "id": 4,
      "task_id": 3,
      "device_id": 3,
      "item_code": "BATTERY",
      "result_status": "PASS",
      "measured_value": "正常",
      "photo_url": "/mock/result-4.jpg",
      "note": "烟感电池电量正常"
    },
    {
      "id": 5,
      "task_id": 3,
      "device_id": 5,
      "item_code": "BRIGHTNESS",
      "result_status": "PASS",
      "measured_value": "正常",
      "photo_url": "/mock/result-5.jpg",
      "note": "应急灯亮度正常"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 1,
      "device_id": 1,
      "item_code": "PRESSURE",
      "severity": "CRITICAL",
      "owner_id": 301,
      "deadline": "2026-09-27",
      "rectify_status": "OPEN",
      "rectify_note": "",
      "rectify_photo_url": "",
      "merged_result_ids": [1, 2],
      "rectified_at": "",
      "recheck_note": "",
      "closed_at": ""
    },
    {
      "id": 2,
      "result_id": 3,
      "device_id": 2,
      "item_code": "VALVE",
      "severity": "HIGH",
      "owner_id": 202,
      "deadline": "2026-09-28",
      "rectify_status": "RECHECK",
      "rectify_note": "已更换阀门密封圈并加压测试",
      "rectify_photo_url": "/mock/rectify-2.jpg",
      "merged_result_ids": [3],
      "rectified_at": "2026-09-24T10:00:00Z",
      "recheck_note": "",
      "closed_at": ""
    }
  ]
} as const;
