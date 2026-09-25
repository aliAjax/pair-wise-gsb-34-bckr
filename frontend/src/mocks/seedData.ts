export const mockData = {
  "building": [
    {
      "id": 1,
      "name": "A栋研发楼",
      "campus": "科创园北区",
      "floor_count": 12,
      "fire_grade": "一级",
      "manager_id": 501,
      "address_code": "BLD-A"
    },
    {
      "id": 2,
      "name": "B栋生产厂房",
      "campus": "科创园南区",
      "floor_count": 4,
      "fire_grade": "二级",
      "manager_id": 502,
      "address_code": "BLD-B"
    },
    {
      "id": 3,
      "name": "C栋员工宿舍",
      "campus": "生活区",
      "floor_count": 6,
      "fire_grade": "一级",
      "manager_id": 503,
      "address_code": "BLD-C"
    }
  ],
  "fireDevice": [
    {
      "id": 1,
      "building_id": 1,
      "device_code": "EXT-A1F-001",
      "device_type": "EXTINGUISHER",
      "floor": "1F",
      "location_desc": "大堂东侧灭火器箱",
      "install_date": "2025-03-11T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-11T09:00:00Z"
    },
    {
      "id": 2,
      "building_id": 1,
      "device_code": "HYD-A2F-002",
      "device_type": "HYDRANT",
      "floor": "2F",
      "location_desc": "走廊尽头消火栓",
      "install_date": "2025-03-12T09:00:00Z",
      "status": "HAZARD_OPEN",
      "next_maintenance_at": "2026-10-12T09:00:00Z"
    },
    {
      "id": 3,
      "building_id": 2,
      "device_code": "SMK-B1F-003",
      "device_type": "SMOKE_DETECTOR",
      "floor": "1F",
      "location_desc": "车间北门烟感",
      "install_date": "2025-04-13T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-13T09:00:00Z"
    },
    {
      "id": 4,
      "building_id": 2,
      "device_code": "SPR-B3F-004",
      "device_type": "SPRINKLER",
      "floor": "3F",
      "location_desc": "仓库上方喷淋头",
      "install_date": "2025-04-14T09:00:00Z",
      "status": "HAZARD_OPEN",
      "next_maintenance_at": "2026-10-14T09:00:00Z"
    },
    {
      "id": 5,
      "building_id": 3,
      "device_code": "EXIT-C1F-005",
      "device_type": "EXIT_LIGHT",
      "floor": "1F",
      "location_desc": "楼梯间疏散指示灯",
      "install_date": "2025-05-15T09:00:00Z",
      "status": "NORMAL",
      "next_maintenance_at": "2026-10-15T09:00:00Z"
    }
  ],
  "inspectionTask": [
    {
      "id": 1,
      "building_id": 1,
      "inspector_id": 1001,
      "plan_date": "2026-09-20T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "IN_PROGRESS",
      "checklist_version": "v2026.09",
      "finished_at": ""
    },
    {
      "id": 2,
      "building_id": 2,
      "inspector_id": 1002,
      "plan_date": "2026-09-21T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "SUBMITTED",
      "checklist_version": "v2026.09",
      "finished_at": ""
    },
    {
      "id": 3,
      "building_id": 1,
      "inspector_id": 1001,
      "plan_date": "2026-10-20T09:00:00Z",
      "task_type": "QUARTERLY",
      "status": "PLANNED",
      "checklist_version": "v2026.10",
      "finished_at": ""
    },
    {
      "id": 4,
      "building_id": 3,
      "inspector_id": 1003,
      "plan_date": "2026-09-18T09:00:00Z",
      "task_type": "MONTHLY",
      "status": "REVIEWED",
      "checklist_version": "v2026.09",
      "finished_at": "2026-09-22T10:00:00Z"
    }
  ],
  "inspectionResult": [
    {
      "id": 1,
      "task_id": 1,
      "device_id": 1,
      "item_code": "EXT-PRESSURE",
      "result_status": "PASS",
      "measured_value": "0.9MPa",
      "photo_url": "/mock/inspect-1.png",
      "note": "压力正常"
    },
    {
      "id": 2,
      "task_id": 1,
      "device_id": 2,
      "item_code": "HYD-PRESSURE",
      "result_status": "FAIL",
      "measured_value": "0.05MPa",
      "photo_url": "/mock/inspect-2.png",
      "note": "栓口出水压力不足"
    },
    {
      "id": 3,
      "task_id": 1,
      "device_id": 2,
      "item_code": "HYD-VALVE",
      "result_status": "PASS",
      "measured_value": "启闭灵活",
      "photo_url": "/mock/inspect-3.png",
      "note": "阀门正常"
    },
    {
      "id": 4,
      "task_id": 2,
      "device_id": 4,
      "item_code": "SPR-LEAK",
      "result_status": "FAIL",
      "measured_value": "接口渗漏",
      "photo_url": "/mock/inspect-4.png",
      "note": "喷淋头接口渗水"
    },
    {
      "id": 5,
      "task_id": 2,
      "device_id": 3,
      "item_code": "SMK-BATTERY",
      "result_status": "PASS",
      "measured_value": "电量 92%",
      "photo_url": "/mock/inspect-5.png",
      "note": "电量正常"
    },
    {
      "id": 6,
      "task_id": 4,
      "device_id": 5,
      "item_code": "EXIT-LIGHT",
      "result_status": "FAIL",
      "measured_value": "应急点亮 8 分钟",
      "photo_url": "/mock/inspect-6.png",
      "note": "应急照明时长不足 30 分钟"
    }
  ],
  "hazardTicket": [
    {
      "id": 1,
      "result_id": 2,
      "severity": "HIGH",
      "owner_id": 301,
      "deadline": "2026-09-28T09:00:00Z",
      "rectify_status": "OPEN",
      "rectify_note": "",
      "rectify_photo_url": "",
      "closed_at": ""
    },
    {
      "id": 2,
      "result_id": 4,
      "severity": "MEDIUM",
      "owner_id": 201,
      "deadline": "2026-09-27T09:00:00Z",
      "rectify_status": "RECHECK",
      "rectify_note": "已更换喷淋头密封圈并复压，接口无渗漏",
      "rectify_photo_url": "/mock/rectify-2.png",
      "closed_at": ""
    },
    {
      "id": 3,
      "result_id": 6,
      "severity": "LOW",
      "owner_id": 101,
      "deadline": "2026-09-30T09:00:00Z",
      "rectify_status": "CLOSED",
      "rectify_note": "已更换应急灯电池组，复测点亮 45 分钟",
      "rectify_photo_url": "/mock/rectify-3.png",
      "closed_at": "2026-09-22T10:00:00Z"
    }
  ]
} as const;
