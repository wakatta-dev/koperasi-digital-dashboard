/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import { api, API_PREFIX } from "./base";

// Ticketing module client wrappers (per docs/modules/ticketing.md)

export function createTicket(payload: {
  title: string;
  category: string; // billing|technical|access|other
  priority: string; // low|medium|high
  description: string;
  attachment_url?: string;
}): Promise<ApiResponse<any>> {
  return api.post<any>(`${API_PREFIX}${API_ENDPOINTS.tickets.create}`, payload);
}

export function listTickets(params: {
  status?: string; // open|in_progress|resolved|closed
  priority?: string;
  category?: string;
  limit: number;
  cursor?: string;
}): Promise<ApiResponse<any[]>> {
  const search = new URLSearchParams({ limit: String(params.limit) });
  if (params.status) search.set("status", params.status);
  if (params.priority) search.set("priority", params.priority);
  if (params.category) search.set("category", params.category);
  if (params.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.tickets.list}`;
  return api.get<any[]>(`${path}?${q}`);
}

export function getTicket(id: string): Promise<ApiResponse<any>> {
  return api.get<any>(`${API_PREFIX}${API_ENDPOINTS.tickets.detail(id)}`);
}

export function addTicketReply(
  id: string,
  payload: { message: string; attachment_url?: string }
): Promise<ApiResponse<any>> {
  return api.post<any>(
    `${API_PREFIX}${API_ENDPOINTS.tickets.replies(id)}`,
    payload
  );
}

export function updateTicket(
  id: string,
  payload: { status?: string; agent_id?: number }
): Promise<ApiResponse<any>> {
  return api.patch<any>(
    `${API_PREFIX}${API_ENDPOINTS.tickets.update(id)}`,
    payload
  );
}

