/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type TenantFeatureFlags = Partial<{
  pos_enabled: boolean;
  inventory_enabled: boolean;
  marketplace_enabled: boolean;
  asset_rental_enabled: boolean;
  reports_enabled: boolean;
}>;

export type TenantOperationalConfigs = Partial<{
  asset_rental: {
    approval_required?: boolean;
    default_slot_minutes?: number;
    min_dp_percent?: number;
    grace_period_hours?: number;
    late_fee_per_hour?: number;
  };
  marketplace: {
    manual_payment_window_min?: number;
    auto_cancel_unpaid_hours?: number;
    low_stock_threshold?: number;
    allow_guest_checkout?: boolean;
  };
  accounting: {
    invoice_prefix?: string;
    fiscal_year_start_month?: number;
    default_payment_terms_days?: number;
    period_lock_after_days?: number;
  };
  [key: string]: unknown;
}>;

export interface SupportGlobalConfig {
  timezone_default: string;
  currency_default: string;
  locale_default: string;
  email_sender: string;
  feature_flags_default: Record<string, boolean>;
  updated_at?: Rfc3339String;
}

export interface SupportTenantConfig {
  tenant_id: number;
  business_name: string;
  business_type: string;
  domain?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  business_category?: string;
  description?: string;
  timezone: string;
  currency: string;
  locale?: string;
  theme?: string;
  custom_domain?: string;
  domain_verified_at?: Rfc3339String;
  feature_flags: TenantFeatureFlags;
  configs?: TenantOperationalConfigs;
  updated_at?: Rfc3339String;
}

export interface UpdateSupportTenantConfigRequest {
  timezone?: string;
  currency?: string;
  locale?: string;
  theme?: string;
  custom_domain?: string;
  business_name?: string;
  business_type?: string;
  business_category?: string;
  description?: string;
  address?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  feature_flags?: TenantFeatureFlags;
  configs?: TenantOperationalConfigs;
}

export interface SupportEmailTemplate {
  id: number;
  code: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  placeholders: string[];
  version: number;
  updated_at: Rfc3339String;
  metadata?: Record<string, unknown>;
}

export interface SendSupportEmailRequest {
  to: string;
  template_id: number;
  variables?: Record<string, unknown>;
}

export interface SupportEmailLog {
  id: number;
  tenant_id?: number;
  recipient: string;
  template_id: number;
  template_code: string;
  template_version: number;
  status: string;
  error?: string;
  metadata?: Record<string, unknown>;
  created_at?: Rfc3339String;
}

export interface SupportActivityLogItem {
  id: number;
  timestamp: Rfc3339String;
  actor_id: number;
  actor_label: string;
  module: string;
  action: string;
  entity_type: string;
  entity_id: number;
  old_status?: string;
  new_status?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  request_id?: string;
}

export interface SupportActivityLogList {
  items: SupportActivityLogItem[];
}

export interface SupportActivityLogParams {
  cursor?: string | number;
  limit?: number;
  from?: string;
  to?: string;
  actor_id?: string | number;
  module?: string;
  action?: string;
}

export type SupportGlobalConfigResponse = ApiResponse<SupportGlobalConfig>;
export type SupportTenantConfigResponse = ApiResponse<SupportTenantConfig>;
export type UpdateSupportTenantConfigResponse = ApiResponse<SupportTenantConfig>;
export type SupportEmailTemplatesResponse = ApiResponse<SupportEmailTemplate[]>;
export type SupportEmailTemplateResponse = ApiResponse<SupportEmailTemplate>;
export type SupportEmailSendResponse = ApiResponse<SupportEmailLog>;
export type SupportActivityLogResponse = ApiResponse<SupportActivityLogList>;

