HazardTicketPayload = dict

# 维保提交整改：rectify_note / rectify_photo_url 均为必填，缺一直接拒绝进入复验
RectifyPayload = dict

# 物业主管复验：confirm=True 确认设备恢复并关单；False 驳回退回整改
ClosePayload = dict
