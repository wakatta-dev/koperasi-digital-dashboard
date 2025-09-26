/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type Segment = "vendor" | "koperasi" | "umkm" | "bumdes";
export type Channel = "IN_APP" | "EMAIL" | "PUSH" | "SMS";
export type NotificationType =
  | "SYSTEM"
  | "BILLING"
  | "RAT"
  | "LOAN"
  | "SAVINGS"
  | "CUSTOM"
  | "PROMOTION";
export type TargetType = "SINGLE" | "ALL" | "GROUP";
export type NotificationStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "SENT"
  | "READ"
  | "ARCHIVED";
export type SendStatus = "PENDING" | "SENT" | "FAILED";
export type ScheduleUnit = "DAY" | "HOUR";

export type Notification = {
  id: string;
  tenant_id?: number;
  business_unit_id?: number;
  user_id?: number;
  segment?: Segment;
  channel: Channel;
  type: NotificationType;
  category: string;
  target_type: TargetType;
  title: string;
  body: string;
  status: NotificationStatus;
  send_status: SendStatus;
  attachment_name?: string;
  attachment_url?: string;
  attachment_type?: string;
  created_by?: number;
  created_at: Rfc3339String;
  sent_at?: Rfc3339String;
  read_at?: Rfc3339String;
  published_at?: Rfc3339String;
  unpublished_at?: Rfc3339String;
  message?: string;
};

export type NotificationReminder = {
  id: string;
  tenant_id: number;
  event_type: string;
  schedule_offset: number;
  schedule_unit: ScheduleUnit;
  active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type DeviceToken = {
  id: string;
  user_id: number;
  token: string;
  created_at: Rfc3339String;
};

export type CreateNotificationRequest = {
  tenant_id: number;
  user_id?: number;
  channel: Channel;
  type: string;
  category: string;
  title: string;
  body: string;
  target_type?: TargetType;
  status?: NotificationStatus;
};

export type UpdateNotificationStatusRequest = {
  status: NotificationStatus;
};

export type ReminderRequest = {
  id?: string;
  event_type: string;
  schedule_offset: number;
  schedule_unit: ScheduleUnit;
  active: boolean;
};

export type DeviceTokenRequest = {
  token: string;
};

export type VendorBroadcastRequest = {
  message: string;
  targetType: TargetType;
  tenantIDs?: number[];
  category: string;
};

export type VendorBulkRequest = {
  message: string;
  targetType: TargetType;
  segment: Segment;
};

export type CreateNotificationResponse = ApiResponse<Notification>;
export type ListNotificationsResponse = ApiResponse<Notification[]>;
export type UpdateNotificationResponse = ApiResponse<Notification>;
export type ReminderListResponse = ApiResponse<NotificationReminder[]>;
export type ReminderMutationResponse = ApiResponse<null>;
export type DeviceTokenResponse = ApiResponse<DeviceToken>;
export type VendorBroadcastResponse = ApiResponse<null>;
export type VendorBulkResponse = ApiResponse<null>;
