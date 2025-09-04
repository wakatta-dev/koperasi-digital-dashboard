/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// Assets module client wrappers (per docs/modules/asset.md)

export function listAssets(): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(`${API_PREFIX}${API_ENDPOINTS.assets.list}`);
}

export function createAsset(payload: Partial<any>): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.assets.list}`, payload);
}

export function updateAsset(
  id: string | number,
  payload: Partial<any>
): Promise<ApiResponse<any>> {
  return api.put<any>(`${API_PREFIX}${API_ENDPOINTS.assets.detail(id)}`, payload);
}

export function deleteAsset(id: string | number): Promise<ApiResponse<any>> {
  return api.delete<any>(`${API_PREFIX}${API_ENDPOINTS.assets.detail(id)}`);
}

export function getAssetDepreciation(
  id: string | number
): Promise<ApiResponse<any[]>> {
  return api.get<any[]>(
    `${API_PREFIX}${API_ENDPOINTS.assets.depreciation(id)}`
  );
}

export function updateAssetStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<any>> {
  return api.patch<any>(`${API_PREFIX}${API_ENDPOINTS.assets.status(id)}`, payload);
}

export function exportAssets(): Promise<ApiResponse<any>> {
  return api.get<any>(`${API_PREFIX}${API_ENDPOINTS.assets.export}`);
}

