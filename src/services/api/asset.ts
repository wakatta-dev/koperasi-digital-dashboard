/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Asset,
  AssetDepreciation,
  AssetListResponse,
  AssetRequest,
  AssetUsage,
  AssetUsageResponse,
  Rfc3339String,
  StatusRequest,
  UpdateAssetRequest,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "./auth";

export function listAssets(
  params?: {
    term?: string;
    category?: string;
    status?: 'active' | 'inactive';
    start_date?: string;
    end_date?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<AssetListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  const q = search.toString();
  return api.get<Asset[]>(
    `${API_PREFIX}${API_ENDPOINTS.assets.list}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function createAsset(payload: AssetRequest): Promise<ApiResponse<Asset>> {
  return api.post<Asset>(`${API_PREFIX}${API_ENDPOINTS.assets.list}`, payload);
}

export function updateAsset(
  id: string | number,
  payload: Partial<UpdateAssetRequest>
): Promise<ApiResponse<Asset>> {
  return api.put<Asset>(
    `${API_PREFIX}${API_ENDPOINTS.assets.detail(id)}`,
    payload
  );
}

export function deleteAsset(id: string | number): Promise<ApiResponse<void>> {
  return api.delete<void>(`${API_PREFIX}${API_ENDPOINTS.assets.detail(id)}`);
}

export function updateAssetStatus(
  id: string | number,
  payload: StatusRequest
): Promise<ApiResponse<void>> {
  return api.patch<void>(
    `${API_PREFIX}${API_ENDPOINTS.assets.status(id)}`,
    payload
  );
}

export function getAssetDepreciation(
  id: string | number,
  params?: { term?: string; start_date?: string; end_date?: string; limit?: number; cursor?: string }
): Promise<ApiResponse<AssetDepreciation[]>> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  return api.get<AssetDepreciation[]>(
    `${API_PREFIX}${API_ENDPOINTS.assets.depreciation(id)}${q ? `?${q}` : ""}`
  );
}

export function listAssetUsages(
  id: string | number,
  params?: { term?: string; start_date?: string; end_date?: string; limit?: number; cursor?: string }
): Promise<AssetUsageResponse> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  return api.get<AssetUsage[]>(
    `${API_PREFIX}${API_ENDPOINTS.assets.usage(id)}${q ? `?${q}` : ""}`
  );
}

export function logAssetUsage(
  id: string | number,
  payload: {
    used_by: string;
    purpose: string;
    start_time: Rfc3339String;
    end_time?: Rfc3339String;
    notes?: string;
  }
): Promise<ApiResponse<AssetUsage>> {
  return api.post<AssetUsage>(
    `${API_PREFIX}${API_ENDPOINTS.assets.usage(id)}`,
    payload
  );
}

export async function exportAssets(params?: {
  type?: string;
  format?: 'pdf' | 'xlsx';
  term?: string;
  category?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
}): Promise<Blob> {
  const search = new URLSearchParams();
  if (params?.type) search.set("type", params.type);
  if (params?.format) search.set("format", params.format);
  if (params?.term) search.set("term", params.term);
  if (params?.category) search.set("category", params.category);
  if (params?.status) search.set("status", params.status);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  const url = `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.assets.export}${search.toString() ? `?${search.toString()}` : ""}`;
  const [token, tenantId] = await Promise.all([getAccessToken(), getTenantId()]);
  const headers: Record<string, string> = { Accept: 'application/octet-stream' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (tenantId) headers['X-Tenant-ID'] = tenantId;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}
