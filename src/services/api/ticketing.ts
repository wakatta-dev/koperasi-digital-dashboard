/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Ticket,
  CreateTicketRequest,
  AddReplyRequest,
  UpdateTicketRequest,
  TicketReply,
  TicketActivityLog,
  TicketCategorySLA,
  SLARequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

// Ticketing module client wrappers (per docs/modules/ticketing.md)

export function createTicket(
  payload: CreateTicketRequest
): Promise<ApiResponse<Ticket>> {
  return api.post<Ticket>(`${API_PREFIX}${API_ENDPOINTS.tickets.create}`, payload);
}

export function listTickets(params: {
  status?: string;
  priority?: string;
  category?: string;
  tenant?: string | number;
  term?: string;
  business_unit_id?: string | number;
  plan_id?: string | number;
  member_id?: string | number;
  limit: number;
  cursor?: string;
}): Promise<ApiResponse<Ticket[]>> {
  const search = new URLSearchParams({ limit: String(params.limit) });
  if (params.status) search.set("status", params.status);
  if (params.priority) search.set("priority", params.priority);
  if (params.category) search.set("category", params.category);
  if (params.tenant) search.set("tenant", String(params.tenant));
  if (params.term) search.set("term", params.term);
  if (params.business_unit_id)
    search.set("business_unit_id", String(params.business_unit_id));
  if (params.plan_id) search.set("plan_id", String(params.plan_id));
  if (params.member_id) search.set("member_id", String(params.member_id));
  if (params.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const path = `${API_PREFIX}${API_ENDPOINTS.tickets.list}`;
  return api.get<Ticket[]>(`${path}?${q}`);
}

export function getTicket(id: string, opts?: { signal?: AbortSignal }): Promise<ApiResponse<Ticket>> {
  return api.get<Ticket>(`${API_PREFIX}${API_ENDPOINTS.tickets.detail(id)}`, {
    signal: opts?.signal,
  });
}

export function addTicketReply(
  id: string,
  payload: AddReplyRequest
): Promise<ApiResponse<TicketReply>> {
  return api.post<TicketReply>(
    `${API_PREFIX}${API_ENDPOINTS.tickets.replies(id)}`,
    payload
  );
}

export function updateTicket(
  id: string,
  payload: UpdateTicketRequest
): Promise<ApiResponse<Ticket>> {
  return api.patch<Ticket>(
    `${API_PREFIX}${API_ENDPOINTS.tickets.update(id)}`,
    payload
  );
}

// New: list replies (vendor) with optional pagination
export function listTicketReplies(
  id: string,
  params?: { limit?: number; cursor?: string }
): Promise<ApiResponse<TicketReply[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.tickets.replies(id)}`;
  return api.get<TicketReply[]>(q ? `${base}?${q}` : base);
}

// New: list activities
export function listTicketActivities(
  id: string,
  params?: { limit?: number; cursor?: string }
): Promise<ApiResponse<TicketActivityLog[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.tickets.activities(id)}`;
  return api.get<TicketActivityLog[]>(q ? `${base}?${q}` : base);
}

// New: SLA config
export function upsertTicketSLA(payload: SLARequest): Promise<ApiResponse<null>> {
  return api.post<null>(`${API_PREFIX}${API_ENDPOINTS.tickets.sla}`, payload);
}

export function listTicketSLA(): Promise<ApiResponse<TicketCategorySLA[]>> {
  return api.get<TicketCategorySLA[]>(`${API_PREFIX}${API_ENDPOINTS.tickets.sla}`);
}
