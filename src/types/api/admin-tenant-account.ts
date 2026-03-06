/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AdminTenantAccountRole =
  | "CLIENT_ADMIN"
  | "FINANCE"
  | "STAFF"
  | "VIEWER"
  | string;

export type AdminTenantAccountListItem = {
  id: number;
  tenant_id: number;
  email: string;
  full_name: string;
  role: AdminTenantAccountRole;
  status: string;
  created_at: Rfc3339String;
};

export type AdminTenantAccountListData = {
  items: AdminTenantAccountListItem[];
};

export type AdminTenantAccountInvitationRequest = {
  tenant_id?: number;
  email_baru: string;
  role: number;
  reason: string;
  resend?: boolean;
  otp: string;
};

export type AdminTenantAccountInvitation = {
  id: number;
  tenant_id: number;
  email: string;
  role_id: number;
  tenant_role_id: number;
  status: string;
  reason: string;
  token_expires_at: Rfc3339String;
  send_count: number;
  last_sent_at: Rfc3339String;
  resend: boolean;
};

export type AdminTenantAccountChangeEmailRequest = {
  email_baru: string;
  reason: string;
  otp: string;
};

export type AdminTenantAccountEmailChange = {
  id: number;
  status: string;
  token_expires_at: Rfc3339String;
  requested_by: number;
  user_id: number;
  tenant_id: number;
};

export type AdminTenantAccountStatusRequest = {
  status: "ACTIVE" | "DEACTIVATED";
  reason?: string;
  otp?: string;
};

export type AdminTenantAccountStatusResult = {
  user_id: number;
  tenant_id: number;
  status: string;
  reason?: string;
  updated_at: Rfc3339String;
};

export type AdminTenantAccountRoleRequest = {
  role_id?: number;
  role?: AdminTenantAccountRole;
  reason?: string;
  otp?: string;
};

export type AdminTenantAccountRoleResult = {
  user_id: number;
  tenant_id: number;
  role_id: number;
  role: AdminTenantAccountRole;
  updated_at: Rfc3339String;
};

export type AdminTenantAccountPasswordResetTicket = {
  user_id: number;
  tenant_id: number;
  token: string;
  expires_at: Rfc3339String;
};

export type AdminTenantAccountListResponse = ApiResponse<AdminTenantAccountListData>;
export type AdminTenantAccountInvitationResponse =
  ApiResponse<AdminTenantAccountInvitation>;
export type AdminTenantAccountEmailChangeResponse =
  ApiResponse<AdminTenantAccountEmailChange>;
export type AdminTenantAccountStatusResponse =
  ApiResponse<AdminTenantAccountStatusResult>;
export type AdminTenantAccountRoleResponse =
  ApiResponse<AdminTenantAccountRoleResult>;
export type AdminTenantAccountPasswordResetResponse =
  ApiResponse<AdminTenantAccountPasswordResetTicket>;
