/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AdminTenantStatus = "ACTIVE" | "DEACTIVATED" | string;

export type AdminTenantListItem = {
  id: number;
  name: string;
  display_name?: string;
  tenant_code: string;
  contact_email?: string;
  domain: string;
  business_type: string;
  status: AdminTenantStatus;
  is_active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type AdminTenantListData = {
  items: AdminTenantListItem[];
};

export type AdminTenantConfiguration = {
  timezone: string;
  currency: string;
  locale: string;
  theme: string;
  configs?: Record<string, unknown>;
};

export type AdminTenantProfile = {
  id: number;
  name: string;
  display_name?: string;
  tenant_code: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  logo_url?: string;
  type: string;
  business_type: string;
  status: AdminTenantStatus;
  is_active: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  domain: string;
  legal_entity?: string;
  business_sector?: string;
  configuration?: AdminTenantConfiguration | null;
};

export type AdminTenantUserSummary = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: boolean;
};

export type AdminTenantAuditLogEntry = {
  id: number;
  action?: string;
  actor?: string;
  old_status?: string;
  new_status?: string;
  changed_by: number;
  tenant_id?: number;
  timestamp: Rfc3339String;
  reason?: string;
};

export type AdminTenantDetail = {
  tenant: AdminTenantProfile;
  users: AdminTenantUserSummary[];
  audit_logs: AdminTenantAuditLogEntry[];
  audit_logs_error?: string;
};

export type AdminTenantUpdateStatusRequest = {
  status: "ACTIVE" | "DEACTIVATED";
  reason?: string;
  note?: string;
};

export type AdminTenantUpdateProfileRequest = {
  name?: string;
  display_name?: string;
  contact_email?: string;
  business_type?: "vendor" | "koperasi" | "umkm" | "bumdes";
  address?: string;
  logo?: string;
  timezone?: string;
  currency?: string;
};

export type AdminTenantStatusResult = {
  tenant_id: number;
  status: AdminTenantStatus;
  updated_at?: Rfc3339String;
};

export type AdminTenantListResponse = ApiResponse<AdminTenantListData>;
export type AdminTenantDetailResponse = ApiResponse<AdminTenantDetail>;
export type AdminTenantProfileResponse = ApiResponse<AdminTenantProfile>;
export type AdminTenantStatusResponse = ApiResponse<AdminTenantStatusResult>;
