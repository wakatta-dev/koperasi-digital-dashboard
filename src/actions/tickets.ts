/** @format */

"use server";

import { apiRequest } from "./api";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Ticket } from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import { listTickets } from "@/services/api";

export async function listTicketsAction(
  params?: { limit?: number; cursor?: string }
): Promise<ApiResponse<Ticket[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const endpoint = search.toString()
    ? `${API_ENDPOINTS.tickets.list}?${search.toString()}`
    : API_ENDPOINTS.tickets.list;
  return apiRequest<Ticket[]>(endpoint);
}

export type ListTicketsActionResult = Awaited<
  ReturnType<typeof listTicketsAction>
>;

export async function listVendorTicketsPage(
  params?: {
    tenant?: string | number;
    status?: string;
    priority?: string;
    category?: string;
    term?: string;
    limit?: number;
    cursor?: string;
  },
): Promise<{
  data: Ticket[];
  meta: ApiResponse<Ticket[]>["meta"];
}> {
  try {
    const res = await listTickets(params);
    const data = ensureSuccess(res);
    return { data, meta: res.meta };
  } catch {
    return {
      data: [],
      meta: {
        request_id: "",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
