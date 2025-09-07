/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import { api, API_PREFIX } from "./base";
import type {
  ApiResponse,
  CreateRATRequest,
  NotifyRequest,
  UploadDocumentRequest,
  CreateVotingItemRequest,
  VoteRequest,
  RAT,
  RATDocument,
  VotingItem,
  VotingResult,
  CreateRATResponse,
  NotifyRATResponse,
  UploadRATDocumentResponse,
  CreateVotingItemResponse,
  VoteResponse,
  GetVotingResultResponse,
  RATHistoryResponse,
} from "@/types/api";

// RAT module client wrappers (per docs/modules/rat.md)

export function createRAT(payload: CreateRATRequest): Promise<CreateRATResponse> {
  return api.post<RAT>(`${API_PREFIX}${API_ENDPOINTS.rat.create}`, payload);
}

export function notifyRAT(
  id: string | number,
  payload: NotifyRequest
): Promise<NotifyRATResponse> {
  return api.post<null>(`${API_PREFIX}${API_ENDPOINTS.rat.notify(id)}`, payload);
}

export function uploadRATDocument(
  id: string | number,
  payload: UploadDocumentRequest
): Promise<UploadRATDocumentResponse> {
  return api.post<null>(`${API_PREFIX}${API_ENDPOINTS.rat.documents(id)}`, payload);
}

export function listRATDocuments(
  id: string | number
): Promise<ApiResponse<RATDocument[]>> {
  return api.get<RATDocument[]>(`${API_PREFIX}${API_ENDPOINTS.rat.documents(id)}`);
}

export function createRATVotingItem(
  id: string | number,
  payload: CreateVotingItemRequest
): Promise<CreateVotingItemResponse> {
  return api.post<VotingItem>(`${API_PREFIX}${API_ENDPOINTS.rat.voting(id)}`, payload);
}

export function voteRAT(
  itemId: string | number,
  payload: VoteRequest
): Promise<VoteResponse> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.rat.vote(itemId)}`,
    payload
  );
}

export function getRATVotingResult(
  itemId: string | number
): Promise<GetVotingResultResponse> {
  return api.get<VotingResult>(`${API_PREFIX}${API_ENDPOINTS.rat.result(itemId)}`);
}

export function listRATHistory(
  params?: {
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal },
): Promise<RATHistoryResponse> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.rat.history}`;
  return api.get<RAT[]>(q ? `${base}?${q}` : base, { signal: opts?.signal });
}
