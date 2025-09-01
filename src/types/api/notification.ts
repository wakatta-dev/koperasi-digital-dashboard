/** @format */

export interface Notification {
  id: number;
  title: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface NotificationReminder {
  id?: number;
  event_type: string;
  schedule_offset: number;
  active: boolean;
}
