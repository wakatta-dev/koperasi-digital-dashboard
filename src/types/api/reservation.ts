/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AvailabilityCheckRequest = {
  asset_id: number;
  start_date: string;
  end_date: string;
};

export type AvailabilityConflict = {
  start_date: string;
  end_date: string;
  type?: "booking" | "maintenance" | "hold";
};

export type AvailabilityCheckResponse = {
  ok: boolean;
  conflicts?: AvailabilityConflict[];
  suggestion?: { start_date: string; end_date: string };
};

export type CreateReservationRequest = {
  asset_id: number;
  start_date: string;
  end_date: string;
  purpose: string;
  renter_name: string;
  renter_contact: string;
  renter_email?: string;
};

export type CreateReservationResponse = {
  reservation_id: number;
  status: "pending_review" | "awaiting_dp";
  hold_expires_at: Rfc3339String;
  guest_token?: string;
  amounts: { total: number; dp: number; remaining: number };
};

export type PaymentSessionRequest = {
  reservation_id: number;
  type: "dp" | "settlement";
  method: string;
  ownership_token?: string;
};

export type PaymentSessionResponse = {
  payment_id: string;
  reservation_id: number;
  type: "dp" | "settlement";
  method: string;
  amount: number;
  pay_by: Rfc3339String;
  status:
    | "initiated"
    | "pending_verification"
    | "succeeded"
    | "failed"
    | "expired";
  normalized_status?: string;
  proof_url?: string | null;
  proof_note?: string | null;
};

export type ReservationLatestPayment = {
  id: string;
  type?: "dp" | "settlement" | string;
  method?: string;
  amount: number;
  status?:
    | "initiated"
    | "pending_verification"
    | "succeeded"
    | "failed"
    | "expired"
    | string;
  normalized_status?: string;
  proof_url?: string | null;
  proof_note?: string | null;
  pay_by?: number;
  created_at?: number;
  updated_at?: number;
};

export type ReservationPaymentClassification = {
  classification_type: "DP" | "DEPOSIT" | "REVENUE_RECOGNITION" | string;
  amount: number;
  reason?: string | null;
  actor_id?: number;
  follow_up_reference?: string | null;
  evidence_reference?: string | null;
  accounting_event_key?: string | null;
  accounting_reference?: string | null;
};

export type ReservationFinancialResolution = {
  outcome_type:
    | "DAMAGE_CHARGE"
    | "PENALTY"
    | "DEPOSIT_APPLIED"
    | "DEPOSIT_REFUNDED"
    | string;
  amount: number;
  reason?: string | null;
  actor_id?: number;
  follow_up_reference?: string | null;
  evidence_reference?: string | null;
  accounting_event_key?: string | null;
  accounting_reference?: string | null;
};

export type GuestLinkVerifyResponse = {
  allowed: boolean;
  expires_at?: Rfc3339String;
  reservation_id?: number;
  status?:
    | "pending_review"
    | "awaiting_dp"
    | "awaiting_payment_verification"
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "completed"
    | "cancelled"
    | "expired"
    | "rejected";
  asset_name?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  amounts?: { total: number; dp: number; remaining: number };
};

export type ReservationTimelineItem = {
  event: string;
  at: Rfc3339String;
  meta?: Record<string, string>;
};

export type ReservationDetailResponse = {
  reservation_id: number;
  asset_id: number;
  asset_name?: string;
  location?: string;
  renter_name?: string;
  renter_contact?: string;
  renter_email?: string;
  purpose?: string;
  submitted_at?: Rfc3339String;
  start_date: string;
  end_date: string;
  status:
    | "pending_review"
    | "awaiting_dp"
    | "awaiting_payment_verification"
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "completed"
    | "cancelled"
    | "expired"
    | "rejected";
  booking_state?: string;
  payment_state?: string;
  normalized_payment_status?: string;
  usage_state?: string;
  return_state?: string;
  rejection_reason?: string | null;
  guest_token?: string;
  amounts: { total: number; dp: number; remaining: number };
  latest_payment?: ReservationLatestPayment | null;
  payment_classifications?: ReservationPaymentClassification[];
  financial_resolutions?: ReservationFinancialResolution[];
  accounting_readiness?: {
    status: "not_ready" | "ready" | "problematic" | "not_applicable" | string;
    reason?: string | null;
    reference?: string | null;
  } | null;
  payment_flow?: "dp" | "settlement_direct" | "pending_decision" | string;
  hold_expires_at?: Rfc3339String;
  timeline?: ReservationTimelineItem[];
};

export type AvailabilityCheckApiResponse =
  ApiResponse<AvailabilityCheckResponse>;
export type CreateReservationApiResponse =
  ApiResponse<CreateReservationResponse>;
export type PaymentSessionApiResponse = ApiResponse<PaymentSessionResponse>;
export type GuestLinkVerifyApiResponse = ApiResponse<GuestLinkVerifyResponse>;
export type ReservationDetailApiResponse =
  ApiResponse<ReservationDetailResponse>;
