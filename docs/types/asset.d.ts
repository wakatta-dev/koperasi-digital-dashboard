import type { Rfc3339String, APIResponse } from './index';

export type DepreciationMethod = 'straight_line' | 'declining_balance';

export interface AssetRequest {
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod;
  useful_life_months: number;
  location?: string;
}

export interface StatusRequest { status: 'active' | 'inactive' }

export interface Asset {
  id: number;
  tenant_id: number;
  code: string;
  name: string;
  category: string;
  acquisition_date: Rfc3339String;
  acquisition_cost: number;
  depreciation_method: DepreciationMethod;
  useful_life_months: number;
  location?: string;
  status: 'active' | 'inactive';
  created_at: Rfc3339String;
}

export interface AssetDepreciation {
  id: number;
  asset_id: number;
  period: Rfc3339String;
  depreciation_amount: number;
  accumulated_depreciation: number;
  book_value: number;
  created_at: Rfc3339String;
}

export interface ListAssetsQuery { limit: number; cursor?: string }

export type CreateAssetRequest = AssetRequest;
export type CreateAssetResponse = Asset;
export type UpdateAssetRequest = AssetRequest;
export type UpdateAssetResponse = Asset;
export type DeleteAssetResponse = void;
export type UpdateAssetStatusRequest = StatusRequest;
export type UpdateAssetStatusResponse = void;
export type ListAssetsResponse = APIResponse<Asset[]>;
export type DepreciationHistoryResponse = APIResponse<AssetDepreciation[]>;
export interface ExportAssetsResponse { message: string }

