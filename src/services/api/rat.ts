/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// RAT module client wrappers (per docs/modules/rat.md)

export function createRAT(payload: {
  year: number;
  date: string; // RFC3339
  agenda?: string;
}): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.rat.create}`, payload);
}

export function notifyRAT(
  id: string | number,
  payload: { message: string }
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${API_ENDPOINTS.rat.notify(id)}`, payload);
}

export function uploadRATDocument(
  id: string | number,
  payload: { type: string; data: string }
): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${API_ENDPOINTS.rat.documents(id)}`, payload);
}

export function createRATVotingItem(
  id: string | number,
  payload: {
    question: string;
    type: string;
    options?: string[];
    open_at: string; // RFC3339
    close_at: string; // RFC3339
  }
): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.rat.voting(id)}`, payload);
}

export function voteRAT(
  itemId: string | number,
  payload: { member_id: number; selected_option: string }
): Promise<ApiResponse<{ status: string }>> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.rat.vote(itemId)}`,
    payload
  );
}

export function getRATVotingResult(
  itemId: string | number
): Promise<ApiResponse<any>> {
  return api.get<any>(`${API_PREFIX}${API_ENDPOINTS.rat.result(itemId)}`);
}

export function listRATHistory(params?: {
  limit?: number;
  cursor?: string;
}): Promise<ApiResponse<any[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.rat.history}`;
  return api.get<any[]>(q ? `${base}?${q}` : base);
}

