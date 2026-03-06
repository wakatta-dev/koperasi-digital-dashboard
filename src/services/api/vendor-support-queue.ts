/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import { ensureSuccess } from "@/lib/api";
import type {
  VendorSupportAnalytics,
  VendorSupportQueueItem,
  VendorSupportQueueSummary,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function getVendorSupportQueueSummary(
  opts?: { signal?: AbortSignal }
): Promise<VendorSupportQueueSummary> {
  return api
    .get<VendorSupportQueueSummary>(
      `${API_PREFIX}${API_ENDPOINTS.adminTickets.list}`,
      { signal: opts?.signal }
    )
    .then(ensureSuccess);
}

export function getVendorSupportTicketDetail(
  ticketId: string,
  opts?: { signal?: AbortSignal }
): Promise<VendorSupportQueueItem> {
  return api
    .get<VendorSupportQueueItem>(
      `${API_PREFIX}${API_ENDPOINTS.adminTickets.detail(ticketId)}`,
      { signal: opts?.signal }
    )
    .then(ensureSuccess);
}

export function getVendorSupportAnalytics(
  opts?: { signal?: AbortSignal }
): Promise<VendorSupportAnalytics> {
  return api
    .get<VendorSupportAnalytics>(
      `${API_PREFIX}${API_ENDPOINTS.adminTickets.analytics}`,
      { signal: opts?.signal }
    )
    .then(ensureSuccess);
}
