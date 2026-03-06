/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  SupportActivityLogParams,
  SupportActivityLogResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listSupportActivityLogs(
  params?: SupportActivityLogParams,
  opts?: { signal?: AbortSignal }
): Promise<SupportActivityLogResponse> {
  const search = new URLSearchParams();
  if (typeof params?.limit !== "undefined") {
    search.set("limit", String(params.limit));
  }
  if (typeof params?.cursor !== "undefined") {
    search.set("cursor", String(params.cursor));
  }
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (typeof params?.actor_id !== "undefined") {
    search.set("actor_id", String(params.actor_id));
  }
  if (params?.module) search.set("module", params.module);
  if (params?.action) search.set("action", params.action);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.activityLogs}${query}`,
    { signal: opts?.signal },
  );
}

