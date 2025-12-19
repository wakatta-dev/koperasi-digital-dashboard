/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AssetAvailabilityApiResponse,
  AssetAvailabilityResponse,
} from "@/types/api/asset";
import type {
  AssetRentalAsset,
  CreateAssetRentalRequest,
  UpdateAssetRentalRequest,
} from "@/types/api/asset-rental";
import type { AssetFilterQuery } from "@/types/api/asset";

const E = API_ENDPOINTS.assets;

export function getAssets(
  params?: AssetFilterQuery
): Promise<ApiResponse<AssetRentalAsset[]>> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);
  if (params?.search) search.set("search", params.search);
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<AssetRentalAsset[]>(`${API_PREFIX}${E.list}${query}`);
}

export function getAssetById(
  id: string | number
): Promise<ApiResponse<AssetRentalAsset>> {
  return api.get<AssetRentalAsset>(`${API_PREFIX}${E.detail(id)}`);
}

export function getAssetAvailability(
  assetId: string | number,
  params?: { start_date?: string; end_date?: string }
): Promise<AssetAvailabilityApiResponse> {
  const now = new Date();
  const start = params?.start_date ?? now.toISOString().slice(0, 10);
  const endDate = params?.end_date
    ? new Date(params.end_date)
    : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const end = endDate.toISOString().slice(0, 10);
  const search = new URLSearchParams({ start_date: start, end_date: end });
  return api
    .get<AssetAvailabilityResponse>(
      `${API_PREFIX}${E.availability(assetId)}?${search.toString()}`
    )
    .then((res) => {
      if (res.success && res.data && !("blocked" in res.data)) {
        const raw: any = res.data;
        const blocked = Array.isArray(raw.conflicts)
          ? raw.conflicts.map((c: any) => ({
              start_date: c.start_date ?? c.startDate,
              end_date: c.end_date ?? c.endDate,
              type: c.type,
            }))
          : [];
        const suggestion = raw.suggestion
          ? {
              start_date: raw.suggestion.start_date ?? raw.suggestion.startDate,
              end_date: raw.suggestion.end_date ?? raw.suggestion.endDate,
            }
          : undefined;
        return { ...res, data: { blocked, suggestion } as AssetAvailabilityResponse };
      }
      return res;
    });
}

export function createAsset(
  payload: CreateAssetRentalRequest
): Promise<ApiResponse<AssetRentalAsset>> {
  return api.post<AssetRentalAsset>(`${API_PREFIX}${E.list}`, payload);
}

export function updateAsset(
  id: string | number,
  payload: UpdateAssetRentalRequest
): Promise<ApiResponse<AssetRentalAsset>> {
  return api.patch<AssetRentalAsset>(`${API_PREFIX}${E.detail(id)}`, payload);
}
