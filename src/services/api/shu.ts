/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  DistributionRequest,
  SHUDistribution,
  SHUDistributionResponse,
  SHUHistoryResponse,
  SHUMemberHistoryResponse,
  YearlySHU,
  YearlySHURequest,
  YearlySHUResponse,
} from "@/types/api";
import { api, API_PREFIX, getTenantId } from "./base";
import { getAccessToken } from "../auth";

export function createYearlySHU(
  payload: YearlySHURequest
): Promise<YearlySHUResponse> {
  return api.post<YearlySHU>(
    `${API_PREFIX}${API_ENDPOINTS.shu.yearly}`,
    payload
  );
}

export function simulateSHU(
  year: string | number
): Promise<SHUSimulationResponse> {
  return api.post<SHUDistribution[]>(
    `${API_PREFIX}${API_ENDPOINTS.shu.simulate(year)}`,
    {}
  );
}

export function distributeSHU(
  year: string | number,
  payload: DistributionRequest
): Promise<SHUDistributionResponse> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.shu.distribute(year)}`,
    payload
  );
}

export function listSHUHistory(
  params?: { term?: string; year?: string; limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<SHUHistoryResponse> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.year) search.set("year", params.year);
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  return api.get<YearlySHU[]>(
    `${API_PREFIX}${API_ENDPOINTS.shu.history}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function listSHUByMember(
  memberId: string | number,
  params?: { term?: string; year?: string; limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<SHUMemberHistoryResponse> {
  const search = new URLSearchParams();
  if (params?.term) search.set("term", params.term);
  if (params?.year) search.set("year", params.year);
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  return api.get<SHUDistribution[]>(
    `${API_PREFIX}${API_ENDPOINTS.shu.member(memberId)}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export async function exportSHURaw(year: string | number): Promise<Blob> {
  const [accessToken, tenantId] = await Promise.all([
    getAccessToken(),
    getTenantId(),
  ]);
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
  if (tenantId) headers['X-Tenant-ID'] = tenantId;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.shu.export(year)}`,
    { headers }
  );
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

type SHUSimulationResponse = ApiResponse<SHUDistribution[]>;
