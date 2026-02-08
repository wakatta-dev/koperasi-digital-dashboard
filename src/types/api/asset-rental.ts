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
  specifications?: AssetSpecification[];
  description?: string;
  status: "ACTIVE" | "ARCHIVED" | string;
};

export type AssetSpecification = {
  label: string;
  value: string;
};

export type AssetRentalBooking = {
  id: number;
  asset_id: number;
  asset_name: string;
  renter_name: string;
  renter_contact?: string;
  purpose?: string;
  start_time: number;
  end_time: number;
  status: "BOOKED" | "COMPLETED" | string;
  total_amount: number;
  completed_at?: number;
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
    | "confirmed_dp"
    | "awaiting_settlement"
    | "confirmed_full"
    | "cancelled"
    | "expired";
  hold_expires_at?: Rfc3339String;
  amounts: { total: number; dp: number; remaining: number };
};
