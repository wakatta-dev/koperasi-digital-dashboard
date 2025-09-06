/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type Segment = 'VENDOR' | 'KOPERASI' | 'UMKM' | 'BUMDES';
export type Channel = 'IN_APP' | 'EMAIL' | 'PUSH';
export type NotificationType = 'SYSTEM' | 'BILLING' | 'RAT' | 'LOAN' | 'SAVINGS' | 'CUSTOM';
export type TargetType = 'SINGLE' | 'ALL' | 'GROUP';
export type NotificationStatus = 'DRAFT' | 'PUBLISHED' | 'SENT' | 'READ' | 'ARCHIVED';
export type SendStatus = 'PENDING' | 'SENT' | 'FAILED';

export interface Notification {
  id: string;
  tenant_id?: number;
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
  created_at: Rfc3339String;
  sent_at?: Rfc3339String;
  read_at?: Rfc3339String;
  // Legacy bridge used in some UI spots
  message?: string;
}

export type NotificationReminder = Partial<{
  id: string;
  tenant_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}> & {
  event_type: string;
  schedule_offset: number;
  active: boolean;
};

export interface CreateNotificationRequest { tenant_id: number; user_id?: number; channel: Channel; type: NotificationType; category: string; title: string; body: string; status?: NotificationStatus }
export interface UpdateNotificationStatusRequest { status: NotificationStatus }
export interface ReminderRequest { id?: string; event_type: string; schedule_offset: number; active?: boolean }
export interface DeviceTokenRequest { token: string }
export interface VendorBroadcastRequest { message: string; targetType: TargetType; tenantIDs?: number[]; category: string }
export interface VendorBulkRequest { message: string; targetType: TargetType; segment: Segment }

export type CreateNotificationResponse = ApiResponse<Notification>;
export type ListNotificationsResponse = ApiResponse<Notification[]>;
export type UpdateNotificationResponse = ApiResponse<{ id: string; status: NotificationStatus }>;
export type GetRemindersResponse = ApiResponse<NotificationReminder[]>;
export type UpsertRemindersResponse = ApiResponse<null>;
export type RegisterDeviceTokenResponse = ApiResponse<{ token: string }>;
export type UnregisterDeviceTokenResponse = ApiResponse<{ token: string }>;
export type VendorBroadcastResponse = ApiResponse<null>;
export type VendorBulkResponse = ApiResponse<null>;
