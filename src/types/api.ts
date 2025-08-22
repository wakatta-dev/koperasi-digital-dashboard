/** @format */

export interface Pagination {
  next_cursor?: string;
  prev_cursor?: string;
  has_next: boolean;
  has_prev: boolean;
  limit: number;
}

export interface Meta {
  pagination?: Pagination;
  request_id: string;
  timestamp: string; // ISO 8601
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: Meta;
  errors: unknown;
}

export interface LoginResponse {
  id: number;
  nama: string;
  role: string;
  jenis_tenant: string;
  email: string;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface RefreshResponse {
  access_token: string;
}

export interface Plan {
  id: number;
  name: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export interface InvoiceItem {
  id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: number;
  tenant_id: number;
  number: string;
  issued_at: string;
  due_date?: string | null;
  total: number;
  status: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  invoice_id: number;
  method: string;
  proof_url: string;
  status: string;
  created_at: string;
}

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

export interface Role {
  id: number;
  name: string;
  description: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
  tenant: Tenant;
}

export interface RoleUser {
  id: number;
  user_id: number;
  role_id: number;
  tenant_id: number;
  created_at: string;
  updated_at: string;
  role: Role;
}

export interface CasbinRule {
  id: number;
  p_type: string;
  v0: string;
  v1: string;
  v2: string;
  v3: string;
  v4: string;
  v5: string;
}

export interface UserTenantAccess {
  id: string;
  user_id: number;
  tenant_id: number;
  role_id: number;
  created_at: string;
  updated_at: string;
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

export interface User {
  id: number;
  tenant_id: number;
  role_id: number;
  email: string;
  password_hash: string;
  full_name: string;
  status: boolean;
  last_login?: string | null;
  created_at: string;
  updated_at: string;
  tenant: Tenant;
  role: Role;
}

export type StringMap = Record<string, string>;
export type NumberMap = Record<string, number>;
