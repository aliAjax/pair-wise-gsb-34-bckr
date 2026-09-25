export interface HazardTicket {
  id: number;
  result_id: number;
  severity: string;
  owner_id: number;
  deadline: string;
  rectify_status: string;
  rectify_note: string;
  rectify_photo_url: string;
  closed_at: string;
}
