/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type AssetRentalAsset = {
  id: number;
  name: string;
  rate_type: "DAILY" | "HOURLY" | string;
  rate_amount: number;
  photo_url?: string;
  category?: string;
  availability_status?: string;
  location?: string;
  serial_number?: string;
  assigned_to?: string;
  purchase_date?: string;
  vendor?: string;
  purchase_price?: number;
  warranty_end_date?: string;
  fixed_asset_register?: AssetRentalFixedAssetRegister;
  specifications?: AssetSpecification[];
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | string;
};

export type AssetRentalFixedAssetRegister = {
  status: "registered_fixed_asset" | string;
  fixed_asset_category: string;
  recognition_date: string;
  rental_linkage_status: "linked_rental_asset" | string;
  fixed_asset_reference: string;
  source_asset_reference: string;
  depreciation_method?: "STRAIGHT_LINE" | "DECLINING_BALANCE" | string;
  useful_life_months?: number;
  residual_value?: number;
  maintenance_classification?: string;
  maintenance_notes?: string;
};

export type AssetSpecification = {
  label: string;
  value: string;
};

export type AssetRentalBookingPayment = {
  id: string;
  type?: string;
  method?: string;
  amount: number;
  status?: string;
  proof_url?: string;
  proof_note?: string;
  pay_by?: number;
  created_at?: number;
  updated_at?: number;
};

export type AssetRentalAccountingReadiness = {
  status: "not_ready" | "ready" | "problematic" | "not_applicable" | string;
  reason?: string;
  reference?: string;
};

export type AssetRentalPaymentClassification = {
  classification_type: "DP" | "DEPOSIT" | "REVENUE_RECOGNITION" | string;
  amount: number;
  reason?: string;
  actor_id?: number;
  follow_up_reference?: string;
  evidence_reference?: string;
  accounting_event_key?: string;
  accounting_reference?: string;
};

export type AssetRentalFinancialResolution = {
  outcome_type:
    | "DAMAGE_CHARGE"
    | "PENALTY"
    | "DEPOSIT_APPLIED"
    | "DEPOSIT_REFUNDED"
    | string;
  amount: number;
  reason?: string;
  actor_id?: number;
  follow_up_reference?: string;
  evidence_reference?: string;
  accounting_event_key?: string;
  accounting_reference?: string;
};

export type AssetRentalBooking = {
  id: number;
  asset_id: number;
  asset_name: string;
  renter_name: string;
  renter_contact?: string;
  renter_email?: string;
  purpose?: string;
  start_time: number;
  end_time: number;
  status: "BOOKED" | "COMPLETED" | "AWAITING_PAYMENT_VERIFICATION" | string;
  rejection_reason?: string;
  total_amount: number;
  completed_at?: number;
  created_at?: number;
  updated_at?: number;
  return_condition?: string;
  return_condition_notes?: string;
  latest_payment?: AssetRentalBookingPayment;
  payment_classifications?: AssetRentalPaymentClassification[];
  financial_resolutions?: AssetRentalFinancialResolution[];
  accounting_readiness?: AssetRentalAccountingReadiness;
};

export type AssetRentalAssetListResponse = ApiResponse<AssetRentalAsset[]>;
export type AssetRentalAssetResponse = ApiResponse<AssetRentalAsset>;
export type AssetRentalBookingListResponse = ApiResponse<AssetRentalBooking[]>;

export type CreateAssetRentalRequest = {
  name: string;
  rate_type: "DAILY" | "HOURLY" | string;
  rate_amount: number;
  category?: string;
  availability_status?: string;
  location?: string;
  serial_number?: string;
  assigned_to?: string;
  purchase_date?: string;
  vendor?: string;
  purchase_price?: number;
  warranty_end_date?: string;
  specifications?: AssetSpecification[];
  description?: string;
};

export type UpdateAssetRentalRequest = Partial<CreateAssetRentalRequest>;

export type RegisterAssetRentalFixedAssetRequest = {
  fixed_asset_category: string;
  recognition_date: string;
};

export type UpdateAssetRentalFixedAssetProfileRequest = {
  depreciation_method: "STRAIGHT_LINE" | "DECLINING_BALANCE" | string;
  useful_life_months: number;
  residual_value?: number;
  maintenance_classification: string;
  maintenance_notes?: string;
};

export type AssetMasterDataKind = "CATEGORY" | "LOCATION" | "STATUS";

export type AssetMasterDataItem = {
  id: number;
  kind: AssetMasterDataKind;
  value: string;
  sort_order: number;
  is_active: boolean;
};

export type AssetMasterDataCollection = {
  categories: AssetMasterDataItem[];
  locations: AssetMasterDataItem[];
  statuses: AssetMasterDataItem[];
};

export type AssetMasterDataRequest = {
  kind: AssetMasterDataKind;
  value: string;
  sort_order?: number;
  is_active?: boolean;
};

export type AssetRentalReservationSummary = {
  reservation_id: string;
  status:
    | "pending_review"
    | "awaiting_dp"
    | "awaiting_payment_verification"
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "completed"
    | "cancelled"
    | "expired";
  hold_expires_at?: Rfc3339String;
  amounts: { total: number; dp: number; remaining: number };
};
