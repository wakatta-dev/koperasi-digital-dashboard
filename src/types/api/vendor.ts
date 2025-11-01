/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export interface VendorAccountInvitationRequest {
  tenant_id?: number;
  email_baru: string;
  role: number;
  reason: string;
  otp: string;
  resend?: boolean;
}

export interface VendorAccountInvitationResponse {
  id: number;
  tenant_id: number;
  role_id: number;
  email: string;
  full_name?: string;
  reason?: string;
  status: string;
  token: string;
  token_expires_at?: Rfc3339String;
  last_sent_at?: Rfc3339String;
  send_count?: number;
}

export type VendorAccountInvitation = {
  request: VendorAccountInvitationRequest;
  response: VendorAccountInvitationResponse;
};

export interface VendorChangeEmailRequest {
  email_baru: string;
  reason: string;
  otp: string;
}

export interface VendorDeactivatePayload {
  tenant_id?: number;
  reason_code?: string;
  comment?: string;
  otp?: string;
  action?: string;
}

export interface VendorDeactivateResult {
  tenant_id: number;
  status: string;
  reason_code?: string;
  comment?: string;
  deactivated_at?: Rfc3339String;
  cancelled_jobs?: string[];
}

export type VendorInvitationResponse = ApiResponse<VendorAccountInvitationResponse>;
export type VendorDeactivateResponse = ApiResponse<VendorDeactivateResult>;
