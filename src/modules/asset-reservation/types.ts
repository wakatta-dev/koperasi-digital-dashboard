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
};

export type ReservationStatus =
  | "pending_review"
  | "waiting_dp"
  | "active_dp_paid"
  | "waiting_settlement"
  | "settled"
  | "expired"
  | "cancelled";

export type PaymentMode = "dp" | "settlement";

export type PaymentType = PaymentMode;

export type PaymentVerificationStatus =
  | "initiated"
  | "pending_verification"
  | "succeeded"
  | "failed"
  | "expired";
