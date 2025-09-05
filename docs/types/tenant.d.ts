import type { APIResponse, Rfc3339String } from './index';

export interface Tenant {
  id: number;
  name: string;
  domain: string;
  type: string;
  status: string;
  is_active: boolean;
  primary_plan_id?: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface UserTenantAccess {
  id: string;
  user_id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface Module { id: string; name: string; code: string; description: string; created_at: Rfc3339String; updated_at: Rfc3339String }
export interface TenantModule {
  id: string;
  tenant_id: number;
  module_id: string;
  status: string;
  start_date?: Rfc3339String;
  end_date?: Rfc3339String;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  name: string;
  code: string;
}

export interface CreateTenantRequest { name: string; type: string; domain: string }
export interface UpdateTenantRequest { name: string; type: string }
export interface UpdateStatusRequest { is_active: boolean }
export interface AddUserRequest { email: string; password: string; full_name: string; tenant_role_id: number }
export interface UpdateModuleRequest { module_id: string; status: 'aktif' | 'nonaktif' }
export interface RegisterRequest { name: string; domain: string; type: string; full_name: string; email: string; password: string; primary_plan_id: number; addon_plan_ids?: number[] }
export interface VerifyRequest { registration_id: string; otp: string }

export type ListTenantsResponse = APIResponse<Tenant[]>;
export type CreateTenantResponse = APIResponse<Tenant>;
export type GetTenantResponse = APIResponse<Tenant>;
export type UpdateTenantResponse = APIResponse<Tenant>;
export type UpdateTenantStatusResponse = APIResponse<{ is_active: boolean }>;
export type AddTenantUserResponse = APIResponse<{ user_id: number }>;
export type ListTenantUsersResponse = APIResponse<UserTenantAccess[]>;
export type ListTenantModulesResponse = APIResponse<TenantModule[]>;
export type UpdateTenantModuleResponse = APIResponse<{ module_id: string; status: string }>;
export type LookupTenantByDomainResponse = APIResponse<{ tenant_id: number; nama: string; type: string; is_active: boolean }>;
export type VendorRegisterTenantResponse = APIResponse<{ registration_id: string }>;
export type VendorVerifyTenantResponse = APIResponse<null>;
export type VendorUpdateTenantStatusResponse = APIResponse<{ is_active: boolean }>;

