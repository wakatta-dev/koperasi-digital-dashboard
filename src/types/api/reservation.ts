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
  amounts: { total: number; dp: number; remaining: number };
};

export type PaymentSessionRequest = {
  reservation_id: number;
  type: "dp" | "settlement";
  method: string;
};

export type PaymentSessionResponse = {
  payment_id: string;
  reservation_id: number;
  type: "dp" | "settlement";
  method: string;
  amount: number;
  pay_by: Rfc3339String;
  status: "initiated" | "pending_verification" | "succeeded" | "failed" | "expired";
  proof_url?: string | null;
  proof_note?: string | null;
};

export type GuestLinkVerifyResponse = {
  allowed: boolean;
  expires_at?: Rfc3339String;
  reservation_id?: number;
  status?:
    | "pending_review"
    | "awaiting_dp"
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
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
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "cancelled"
    | "expired"
    | "rejected";
  rejection_reason?: string | null;
  amounts: { total: number; dp: number; remaining: number };
  hold_expires_at?: Rfc3339String;
  timeline?: ReservationTimelineItem[];
};

export type AvailabilityCheckApiResponse = ApiResponse<AvailabilityCheckResponse>;
export type CreateReservationApiResponse = ApiResponse<CreateReservationResponse>;
export type PaymentSessionApiResponse = ApiResponse<PaymentSessionResponse>;
export type GuestLinkVerifyApiResponse = ApiResponse<GuestLinkVerifyResponse>;
export type ReservationDetailApiResponse = ApiResponse<ReservationDetailResponse>;
