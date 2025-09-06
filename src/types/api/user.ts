/** @format */

import type { Rfc3339String } from './common';
import type { Role } from './role';
import type { Tenant } from './tenant';

export interface UserBase {
  id: number;
  tenant_id: number;
  tenant_role_id: number;
  email: string;
  full_name: string;
  status: boolean;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

// Extend with optional fields actually used by UI (compatible superset)
export type User = UserBase & {
  role?: Role;
  tenant?: Tenant;
  last_login?: string | null;
  // Backward-compat for older payloads
  role_id?: number;
  password_hash?: string;
};
