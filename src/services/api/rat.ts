/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  CreateRATRequest,
  CreateVotingItemRequest,
  NotifyRATRequest,
  RAT,
  RATHistoryResponse,
  RATReport,
  RATReportResponse,
  RATResponse,
  RATStatusResponse,
  RATDocumentResponse,
  UploadDocumentRequest,
  VoteRequest,
  VotingItem,
  VotingItemResponse,
  VotingResult,
  VotingResultResponse,
  RATDocument,
  RATDocumentListResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function createRAT(payload: CreateRATRequest): Promise<RATResponse> {
  return api.post<RAT>(`${API_PREFIX}${API_ENDPOINTS.rat.create}`, payload);
}

export function notifyRAT(
  id: string | number,
  payload: NotifyRATRequest
): Promise<RATStatusResponse> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.rat.notify(id)}`,
    payload
  );
}

export function uploadRATDocument(
  id: string | number,
  payload: UploadDocumentRequest
): Promise<RATDocumentResponse> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.rat.documents(id)}`,
    payload
  );
}

export function createRATVotingItem(
  id: string | number,
  payload: CreateVotingItemRequest
): Promise<VotingItemResponse> {
  return api.post<VotingItem>(
    `${API_PREFIX}${API_ENDPOINTS.rat.voting(id)}`,
    payload
  );
}

export function voteRAT(
  itemId: string | number,
  payload: VoteRequest
): Promise<RATStatusResponse> {
  return api.post<{ status: string }>(
    `${API_PREFIX}${API_ENDPOINTS.rat.vote(itemId)}`,
    payload
  );
}

export function getRATVotingResult(
  itemId: string | number
): Promise<VotingResultResponse> {
  return api.get<VotingResult>(
    `${API_PREFIX}${API_ENDPOINTS.rat.result(itemId)}`
  );
}

export function getRATReport(
  id: string | number
): Promise<RATReportResponse> {
  return api.get<RATReport>(
    `${API_PREFIX}${API_ENDPOINTS.rat.report(id)}`
  );
}

export function listRATHistory(
  params?: {
    term?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<RATHistoryResponse> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.start_date) search.set("start_date", params.start_date);
  if (params?.end_date) search.set("end_date", params.end_date);
  const q = search.toString();
  return api.get<RAT[]>(
    `${API_PREFIX}${API_ENDPOINTS.rat.history}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function listRATDocuments(
  id: string | number,
  opts?: { signal?: AbortSignal }
): Promise<RATDocumentListResponse> {
  return api.get<RATDocument[]>(
    `${API_PREFIX}${API_ENDPOINTS.rat.documents(id)}`,
    { signal: opts?.signal }
  );
}
