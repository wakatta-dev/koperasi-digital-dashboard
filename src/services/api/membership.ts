/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";
import type { MemberListItem } from "@/types/api";

// Membership module client wrappers (per docs/modules/membership.md)

export function registerMember(payload: {
  user_id: number;
  no_anggota: string;
  initial_deposit?: number;
  documents?: Array<{ type: string; file_url: string }>;
}): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.membership.register}`, payload);
}

export function verifyMember(
  id: string | number,
  payload: { approve: boolean; reason?: string }
): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.membership.verify(id)}`, payload);
}

export function getMember(id: string | number): Promise<ApiResponse<any>> {
  return api.get<any>(`${API_PREFIX}${API_ENDPOINTS.membership.detail(id)}`);
}

export function updateMemberStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<any>> {
  return api.patch<any>(`${API_PREFIX}${API_ENDPOINTS.membership.status(id)}`, payload);
}

export function createMemberCard(id: string | number): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.membership.card(id)}`);
}

export function validateMemberCard(qr: string): Promise<ApiResponse<any>> {
  return api.get<any>(`${API_PREFIX}${API_ENDPOINTS.membership.cardValidate(qr)}`);
}

export function listMembers(
  params?: Record<string, string | number>,
): Promise<ApiResponse<MemberListItem[]>> {
  const query = params ? `?${new URLSearchParams(params as any).toString()}` : "";
  return api.get<MemberListItem[]>(`${API_PREFIX}${API_ENDPOINTS.membership.list}${query}`);
}
