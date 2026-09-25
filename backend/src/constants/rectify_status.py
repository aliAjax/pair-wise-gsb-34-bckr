# 隐患整改单状态机：OPEN -> RECHECK -> CLOSED（复验驳回退回 OPEN）
RectifyStatus = ["OPEN", "RECHECK", "CLOSED"]

# 未关闭即“有效隐患”：设备台账与任务清单的联动判断都基于这个集合
OPEN_RECTIFY_STATUS = ["OPEN", "RECHECK"]
