/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Member,
  MemberCard,
  MemberCardResponse,
  MemberListItem,
  MemberListResponse,
  MemberProfile,
  MemberProfileResponse,
  RegisterMemberRequest,
  RegisterMemberResponse,
  UpdateMemberProfileRequest,
  UpdateMemberStatusRequest,
  VerifyMemberRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function registerMember(
  payload: RegisterMemberRequest
): Promise<ApiResponse<RegisterMemberResponse>> {
  return api.post<RegisterMemberResponse>(
    `${API_PREFIX}${API_ENDPOINTS.membership.register}`,
    payload
  );
}

export function verifyMember(
  id: string | number,
  payload: VerifyMemberRequest
): Promise<ApiResponse<Member>> {
  return api.post<Member>(
    `${API_PREFIX}${API_ENDPOINTS.membership.verify(id)}`,
    payload
  );
}

export function getMember(
  id: string | number,
  opts?: { signal?: AbortSignal }
): Promise<MemberProfileResponse> {
  return api.get<MemberProfile>(
    `${API_PREFIX}${API_ENDPOINTS.membership.detail(id)}`,
    { signal: opts?.signal }
  );
}

export function updateMember(
  id: string | number,
  payload: UpdateMemberProfileRequest
): Promise<ApiResponse<Member>> {
  return api.put<Member>(
    `${API_PREFIX}${API_ENDPOINTS.membership.detail(id)}`,
    payload
  );
}

export function updateMemberStatus(
  id: string | number,
  payload: UpdateMemberStatusRequest
): Promise<ApiResponse<null>> {
  return api.patch<null>(
    `${API_PREFIX}${API_ENDPOINTS.membership.status(id)}`,
    payload
  );
}

export function createMemberCard(
  id: string | number
): Promise<MemberCardResponse> {
  return api.post<MemberCard>(
    `${API_PREFIX}${API_ENDPOINTS.membership.card(id)}`,
    {}
  );
}

export function getMemberCard(
  id: string | number
): Promise<MemberCardResponse> {
  return api.get<MemberCard>(
    `${API_PREFIX}${API_ENDPOINTS.membership.card(id)}`
  );
}

export function validateMemberCard(
  qr: string,
  params?: { rat_id?: string | number }
): Promise<ApiResponse<Member>> {
  const search = new URLSearchParams();
  if (params?.rat_id) search.set("rat_id", String(params.rat_id));
  const path = `${API_PREFIX}${API_ENDPOINTS.membership.cardValidate(qr)}`;
  return api.get<Member>(
    search.size ? `${path}?${search.toString()}` : path
  );
}

export function listMembers(
  params?: {
    term?: string;
    status?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<MemberListResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.status) search.set("status", params.status);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  const q = search.toString();
  return api.get<MemberListItem[]>(
    `${API_PREFIX}${API_ENDPOINTS.membership.list}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}
