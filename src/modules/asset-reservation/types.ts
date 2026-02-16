/** @format */

export type AssetStatus = "available" | "rented" | "maintenance";

export type AssetItem = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  status: AssetStatus;
  imageUrl: string;
  rawPrice?: number;
};

export type ReservationStatus =
  | "pending_review"
  | "awaiting_dp"
  | "awaiting_payment_verification"
  | "confirmed_dp"
  | "awaiting_settlement"
  | "confirmed_full"
  | "completed"
  | "cancelled"
  | "rejected"
  | "expired";

export type PaymentMode = "dp" | "settlement";

export type PaymentType = PaymentMode;

export type PaymentVerificationStatus =
  | "initiated"
  | "pending_verification"
  | "succeeded"
  | "failed"
  | "expired";

export type AvailabilityCheckRequest = {
  assetId: string;
  start: string; // ISO date
  end: string; // ISO date
};

export type AvailabilityConflict = {
  start: string;
  end: string;
  type?: "booking" | "maintenance" | "hold";
};

export type AvailabilityCheckResult = {
  ok: boolean;
  conflicts?: AvailabilityConflict[];
  suggestion?: { start: string; end: string };
};

export type ReservationSummary = {
  reservationId: number;
  assetId: number;
  assetName?: string;
  status: ReservationStatus;
  startDate: string;
  endDate: string;
  renterName?: string;
  renterContact?: string;
  purpose?: string;
  submittedAt?: string;
  holdExpiresAt?: string;
  guestToken?: string;
  latestPayment?: {
    id: string;
    type?: string;
    method?: string;
    amount: number;
    status?: string;
    proofUrl?: string;
    proofNote?: string;
    payBy?: number;
    createdAt?: number;
    updatedAt?: number;
  };
  paymentFlow?: "dp" | "settlement_direct" | "pending_decision" | string;
  amounts: { total: number; dp: number; remaining: number };
  timeline?: Array<{
    event: string;
    at: string;
    meta?: Record<string, string>;
  }>;
};

export type PaymentSession = {
  paymentId: string;
  reservationId: number;
  type: PaymentMode;
  method: string;
  amount: number;
  payBy: string;
  status: PaymentVerificationStatus;
};

export type GuestLinkAccess = {
  allowed: boolean;
  expiresAt?: string;
  reservationSummary?: Pick<
    ReservationSummary,
    "reservationId" | "status" | "startDate" | "endDate" | "amounts"
  > & { assetName?: string; location?: string };
};
