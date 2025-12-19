/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  Asset,
  AssetAvailabilityApiResponse,
  AssetAvailabilityResponse,
  AssetCategoriesResponse,
  AssetFilterQuery,
} from "@/types/api/asset";

const E = API_ENDPOINTS.assets;

export function getAssets(params?: AssetFilterQuery): Promise<ApiResponse<Asset[]>> {
  const search = new URLSearchParams();
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);
  if (params?.search) search.set("search", params.search);
  if (params?.sort) search.set("sort", params.sort);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<Asset[]>(`${API_PREFIX}${E.list}${query}`);
}

export function getAssetById(id: string | number): Promise<ApiResponse<Asset>> {
  return api.get<Asset>(`${API_PREFIX}${E.detail(id)}`);
}

export function getAssetCategories(): Promise<AssetCategoriesResponse> {
  return api.get<AssetCategoriesResponse["data"]>(`${API_PREFIX}${E.categories}`);
}

export function getAssetAvailability(assetId: string | number): Promise<AssetAvailabilityApiResponse> {
  return api.get<AssetAvailabilityResponse>(`${API_PREFIX}${E.availability(assetId)}`);
}
