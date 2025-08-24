/** @format */

export interface Tenant {
  id: number;
  name: string;
  domain: string;
  type: string;
  status: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface TenantModule {
  id: string;
  tenant_id: number;
  module_id: string;
  status: string;
  start_date?: string | null;
  end_date?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserTenantAccess {
  id: string;
  user_id: number;
  tenant_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
}
