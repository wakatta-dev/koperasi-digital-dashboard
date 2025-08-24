/** @format */

import type { Tenant } from "./tenant";

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

export type UserRole = RoleUser;

export interface Permission {
  id: number;
  ptype: string;
  v0: string;
  v1: string;
  v2: string;
  v3: string;
  v4?: string;
  v5?: string;
}
