/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type TenantType = "vendor" | "koperasi" | "umkm" | "bumdes" | string;

export interface RegisterTenantRequest {
  name: string;
  type: TenantType;
  domain: string;
  email: string;
  full_name: string;
  password: string;
  pic_name: string;
  pic_email: string;
  pic_phone: string;
  primary_plan_id: number;
  addon_plan_ids?: number[];
  address?: string;
  legal_entity?: string;
}

export interface VerifyTenantRequest {
  registration_id: string;
  otp: string;
}

export interface TenantStatusRequest {
  status: string;
  reason?: string;
}

export type TenantStatusResponse = ApiResponse<Record<string, string | boolean>>;

export interface TenantConfigurationRequest {
  locale: string;
  theme: string;
  timezone: string;
  custom_domain?: string;
}

export interface TenantConfiguration {
  tenant_id: number;
  locale: string;
  theme: string;
  timezone: string;
  custom_domain?: string;
  persisted?: boolean;
  domain_verified_at?: Rfc3339String;
  created_at?: Rfc3339String;
  updated_at?: Rfc3339String;
}

export interface TenantProfile {
  id: number;
  name: string;
  domain?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  business_category?: string;
  description?: string;
  logo_url?: string;
  updated_at?: Rfc3339String;
}

export type TenantProfileResponse = ApiResponse<TenantProfile>;
export type TenantConfigurationResponse = ApiResponse<TenantConfiguration>;

export interface AuditLogQuery {
  limit?: number;
  cursor?: string;
  from?: string;
  to?: string;
  actor_id?: number;
  target_tenant_id?: number;
}

export type TenantAuditLogResponse = ApiResponse<Record<string, unknown>>;
