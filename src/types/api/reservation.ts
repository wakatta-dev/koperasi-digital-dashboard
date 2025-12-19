/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AvailabilityCheckRequest = {
  asset_id: string;
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
  asset_id: string;
  start_date: string;
  end_date: string;
  purpose: string;
  renter_name?: string;
  renter_contact?: string;
};

export type CreateReservationResponse = {
  reservation_id: string;
  status: "pending_review" | "awaiting_dp";
  hold_expires_at: Rfc3339String;
  amounts: { total: number; dp: number; remaining: number };
};

export type PaymentSessionRequest = {
  reservation_id: string;
  type: "dp" | "settlement";
  method: string;
};

export type PaymentSessionResponse = {
  payment_id: string;
  reservation_id: string;
  type: "dp" | "settlement";
  method: string;
  amount: number;
  pay_by: Rfc3339String;
  status: "initiated" | "pending_verification" | "succeeded" | "failed" | "expired";
};

export type GuestLinkVerifyResponse = {
  allowed: boolean;
  expires_at?: Rfc3339String;
  reservation_id?: string;
  status?:
    | "pending_review"
    | "awaiting_dp"
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "cancelled"
    | "expired";
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
  reservation_id: string;
  asset_id: string;
  asset_name?: string;
  location?: string;
  renter_name?: string;
  renter_contact?: string;
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
    | "expired";
  amounts: { total: number; dp: number; remaining: number };
  hold_expires_at?: Rfc3339String;
  timeline?: ReservationTimelineItem[];
};

export type AvailabilityCheckApiResponse = ApiResponse<AvailabilityCheckResponse>;
export type CreateReservationApiResponse = ApiResponse<CreateReservationResponse>;
export type PaymentSessionApiResponse = ApiResponse<PaymentSessionResponse>;
export type GuestLinkVerifyApiResponse = ApiResponse<GuestLinkVerifyResponse>;
export type ReservationDetailApiResponse = ApiResponse<ReservationDetailResponse>;
