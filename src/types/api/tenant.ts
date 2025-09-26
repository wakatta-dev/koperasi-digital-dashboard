/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type TenantDetail = {
  id: number;
  name: string;
  legal_entity?: string;
  domain: string;
  type: "koperasi" | "bumdes" | "umkm" | "vendor";
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url?: string;
  business_category?: string;
  description?: string;
  social_links?: Record<string, string>;
  status: "active" | "inactive" | "suspended";
  is_active: boolean;
  suspended_at?: Rfc3339String;
  primary_plan_id?: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type TenantUser = {
  id: string;
  user_id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type TenantModule = {
  id: string;
  tenant_id: number;
  module_id: string;
  business_unit_id?: number;
  status: "aktif" | "nonaktif";
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
  code: string;
  name: string;
};

export type CreateTenantRequest = {
  name: string;
  type: "koperasi" | "bumdes" | "umkm";
  domain: string;
  primary_plan_id?: number;
  module_ids?: string[];
};

export type UpdateTenantRequest = {
  name: string;
  type: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  address: string;
};

export type UpdateTenantStatusRequest = {
  status: "active" | "inactive" | "suspended";
};

export type AddTenantUserRequest = {
  email: string;
  password: string;
  full_name: string;
  tenant_role_id: number;
};

export type UpdateTenantModuleRequest = {
  module_id: string;
  status: "aktif" | "nonaktif";
};

export type UpdateTenantProfileRequest = Partial<{
  name: string;
  domain: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  logo_url: string;
  business_category: string;
  description: string;
  social_links: Record<string, string>;
}>;

export type TenantListResponse = ApiResponse<TenantDetail[]>;
export type TenantDetailResponse = ApiResponse<TenantDetail>;
export type TenantUserListResponse = ApiResponse<TenantUser[]>;
export type TenantModuleListResponse = ApiResponse<TenantModule[]>;
export type TenantStatusUpdateResponse = ApiResponse<{ status: string }>;
export type TenantModuleUpdateResponse = ApiResponse<TenantModule>;

// Backward-compatible aliases
export type Tenant = TenantDetail;
export type UserTenantAccess = TenantUser;
