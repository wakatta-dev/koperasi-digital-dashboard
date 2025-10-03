/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  Client,
  ClientActivePlan,
  ClientActivityEntry,
  ClientActivityResponse,
  ClientListResponse,
  ClientPlanResponse,
  ClientStatusResponse,
  UpdateClientPlanRequest,
  UpdateClientStatusRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listClients(
  params?: {
    term?: string;
    type?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<ClientListResponse> {
  const search = new URLSearchParams();
  const limit = params?.limit ?? 10;
  search.set("limit", String(limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.type) search.set("type", params.type);
  if (params?.status) search.set("status", params.status);
  const query = search.toString();

  return api.get<Client[]>(
    `${API_PREFIX}${API_ENDPOINTS.clients.list}${query ? `?${query}` : ""}`,
    { signal: opts?.signal }
  );
}

export function updateClientPlan(
  id: string | number,
  payload: UpdateClientPlanRequest,
): Promise<ClientPlanResponse> {
  return api.put<ClientActivePlan>(
    `${API_PREFIX}${API_ENDPOINTS.clients.plan(id)}`,
    payload,
  );
}

export function updateClientStatus(
  id: string | number,
  payload: UpdateClientStatusRequest,
): Promise<ClientStatusResponse> {
  return api.patch<{ id: number; status: string; is_active: boolean }>(
    `${API_PREFIX}${API_ENDPOINTS.clients.status(id)}`,
    payload,
  );
}

export function listClientActivity(
  id: string | number,
  params?: { limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<ClientActivityResponse> {
  const search = new URLSearchParams();
  const limit = params?.limit ?? 10;
  search.set("limit", String(limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const query = search.toString();

  return api.get<ClientActivityEntry[]>(
    `${API_PREFIX}${API_ENDPOINTS.clients.activity(id)}${query ? `?${query}` : ""}`,
    { signal: opts?.signal }
  );
}
