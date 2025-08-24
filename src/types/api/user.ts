/** @format */

import type { Tenant } from "./tenant";
import type { Role } from "./role";

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
