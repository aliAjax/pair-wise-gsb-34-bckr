export interface HazardTicket {
  id: number;
  result_id: number;
  device_id: number;
  item_code: string;
  severity: string;
  owner_id: number;
  deadline: string;
  rectify_status: string;
  rectify_note: string;
  rectify_photo_url: string;
  merged_result_ids: number[];
  rectified_at: string;
  recheck_note: string;
  closed_at: string;
}
