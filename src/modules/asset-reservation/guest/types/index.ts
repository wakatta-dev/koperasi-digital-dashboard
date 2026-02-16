/** @format */

export type GuestAssetCategoryChipTone =
  | "primary"
  | "orange"
  | "blue"
  | "emerald"
  | "purple";

export type GuestAssetCategoryChip = {
  key: string;
  label: string;
  icon: string;
  tone: GuestAssetCategoryChipTone;
};

export type GuestAssetStatusTone = "available" | "busy" | "maintenance";

export type GuestAssetCardItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  priceLabel: string;
  unitLabel: string;
  statusLabel: string;
  statusTone: GuestAssetStatusTone;
  imageUrl: string;
  featured?: boolean;
};

export type GuestReservationStatus =
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
