/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type DepreciationMethod = 'straight_line' | 'declining_balance';

export type AssetCategory = {
  id: string;
  name: string;
};

export type AssetAvailabilityRange = {
  start_date: string;
  end_date: string;
  type?: 'booking' | 'maintenance' | 'hold';
};

export type AssetAvailabilityResponse = {
  blocked: AssetAvailabilityRange[];
  suggestion?: { start_date: string; end_date: string };
};

export type AssetFilterQuery = {
  category?: string;
  status?: 'available' | 'maintenance' | 'rented';
  search?: string;
  sort?: 'popular' | 'price_asc' | 'price_desc' | 'newest';
  cursor?: string | number;
  limit?: number;
};

export type AssetRequest = {
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod | string;
  useful_life_months: number;
  location: string;
};

export type StatusRequest = { status: 'active' | 'inactive' };

export type Asset = {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod | string;
  useful_life_months: number;
  location: string;
  status: 'active' | 'inactive';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type AssetDepreciation = {
  id: number;
  asset_id: number;
  period: Rfc3339String;
  amount: number;
  accumulated: number;
};

export type AssetUsage = {
  id: number;
  asset_id: number;
  used_by: string;
  purpose: string;
  start_time: Rfc3339String;
  end_time?: Rfc3339String;
  notes?: string;
};

export type CreateAssetRequest = AssetRequest;
export type CreateAssetResponse = Asset;
export type UpdateAssetRequest = AssetRequest;
export type UpdateAssetResponse = Asset;
export type DeleteAssetResponse = void;
export type UpdateAssetStatusRequest = StatusRequest;
export type UpdateAssetStatusResponse = void;
export type AssetListResponse = ApiResponse<Asset[]>;
export type AssetDepreciationResponse = ApiResponse<AssetDepreciation[]>;
export type AssetUsageResponse = ApiResponse<AssetUsage[]>;
export type AssetCategoriesResponse = ApiResponse<AssetCategory[]>;
export type AssetAvailabilityApiResponse = ApiResponse<AssetAvailabilityResponse>;
