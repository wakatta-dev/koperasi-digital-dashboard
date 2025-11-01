/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type NotificationChannel = "IN_APP" | "EMAIL" | "PUSH" | "SMS" | string;

export type Notification = {
  id: string | number;
  tenant_id?: number;
  user_id?: number;
  channel: NotificationChannel;
  category?: string;
  title?: string;
  body?: string;
  status?: string;
  send_status?: string;
  created_at?: Rfc3339String;
  sent_at?: Rfc3339String;
  read_at?: Rfc3339String;
  metadata?: Record<string, unknown>;
};

export type NotificationMetrics = {
  total_attempts: number;
  total_failures: number;
  failure_rate: number;
  channel_summaries: ChannelSummary[];
  daily: DailyMetric[];
};

export type ChannelSummary = {
  channel: string;
  total?: number;
  delivered?: number;
  failed?: number;
  success_rate?: number;
  failure_rate?: number;
};

export type DailyMetric = {
  date: string;
  channel: string;
  total?: number;
  sent?: number;
  queued?: number;
  delivered?: number;
  failed?: number;
};

export type UserPreferenceRecord = {
  id: number;
  tenant_id: number;
  user_id: number;
  template_code: string;
  channel_code: string;
  enabled: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  updated_by?: number;
};

export type PreferenceUpdate = {
  template: string;
  channel: string;
  enabled: boolean;
};

export type NotificationPreferencePayload = {
  preferences: PreferenceUpdate[];
};

export type NotificationPreferences = {
  preferences: UserPreferenceRecord[];
  server_time: Rfc3339String;
};

export type NotificationTemplate = {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  description?: string;
  category?: string;
  channel_code: string;
  critical?: boolean;
  active_version_id?: number;
  created_at: Rfc3339String;
  created_by?: number;
  updated_at?: Rfc3339String;
  updated_by?: number;
};

export type NotificationTemplateList = {
  templates: NotificationTemplate[];
  total: number;
};

export type NotificationTemplateVersion = {
  id: number;
  template_id: number;
  version: number;
  title?: string;
  body?: string;
  change_note?: string;
  variables?: Record<string, unknown>;
  created_at: Rfc3339String;
  created_by?: number;
};

export type NotificationTemplatePreview = {
  template_id: number;
  template_code: string;
  channel_code: string;
  category?: string;
  title?: string;
  body?: string;
  version?: number;
  critical?: boolean;
  change_note?: string;
  last_modified_at?: Rfc3339String;
  last_modified_by?: number;
  variables?: Record<string, unknown>;
};

export type ListNotificationsResponse = ApiResponse<Notification[]>;
export type NotificationMetricsResponse = ApiResponse<NotificationMetrics>;
export type NotificationPreferencesResponse = ApiResponse<NotificationPreferences>;
export type NotificationTemplatesResponse = ApiResponse<NotificationTemplateList>;
export type NotificationTemplateResponse = ApiResponse<NotificationTemplate>;
export type NotificationTemplatePreviewResponse =
  ApiResponse<NotificationTemplatePreview>;
export type NotificationTemplateVersionsResponse =
  ApiResponse<NotificationTemplateVersion[]>;
