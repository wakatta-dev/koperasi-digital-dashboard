/** @format */

import type { Rfc3339String } from './common';

export interface Role {
  id: number;
  name: string;
  jenis_tenant: string;
  description: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TenantRole {
  id: number;
  tenant_id: number;
  role_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface RoleUser {
  id: number;
  user_id: number;
  role_id: number;
  tenant_id: number;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
  role?: Role;
}

export interface CasbinRule {
  id: number;
  p_type: string;
  v0?: string; v1?: string; v2?: string; v3?: string; v4?: string; v5?: string;
}

export type Permission = CasbinRule; // local naming alias
export type UserRole = RoleUser; // backward compat
