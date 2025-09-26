/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type FileMetadata = {
  name: string;
  url: string;
  type: string;
  size: number;
};

export type Ticket = {
  id: string;
  tenant_id: number;
  user_id: number;
  member_id?: number;
  agent_id?: number;
  business_unit_id?: number;
  title: string;
  category: "billing" | "technical" | "other";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "pending" | "closed";
  description: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  first_response_at?: Rfc3339String;
  pending_at?: Rfc3339String;
  resolved_at?: Rfc3339String;
  first_response_minutes?: number;
  first_response_sla_delta_minutes?: number;
  resolution_minutes?: number;
  resolution_sla_delta_minutes?: number;
  escalation_level: number;
  product_plan_id?: number;
  plan_name?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type TicketReply = {
  id: string;
  ticket_id: string;
  user_id: number;
  business_unit_id?: number;
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  created_at: Rfc3339String;
};

export type TicketActivityLog = {
  id: string;
  ticket_id: string;
  actor_id: number;
  business_unit_id?: number;
  action: string;
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
  created_at: Rfc3339String;
};

export type TicketCategorySLA = {
  category: string;
  sla_response_minutes: number;
  sla_resolution_minutes: number;
};

export type CreateTicketRequest = {
  title: string;
  category: Ticket["category"];
  priority: Ticket["priority"];
  description: string;
  business_unit_id?: number;
  attachment_url?: string;
  attachment?: FileMetadata;
};

export type AddReplyRequest = {
  message: string;
  attachment_url?: string;
  attachment?: FileMetadata;
};

export type UpdateTicketRequest = {
  status?: Ticket["status"];
  agent_id?: number;
};

export type SLARequest = {
  category: string;
  sla_response_minutes: number;
  sla_resolution_minutes: number;
};

export type CreateTicketResponse = ApiResponse<Ticket>;
export type ListTicketsResponse = ApiResponse<Ticket[]>;
export type GetTicketResponse = ApiResponse<Ticket>;
export type AddReplyResponse = ApiResponse<TicketReply>;
export type UpdateTicketResponse = ApiResponse<Ticket>;
export type ListActivitiesResponse = ApiResponse<TicketActivityLog[]>;
export type ListRepliesResponse = ApiResponse<TicketReply[]>;
export type SetSLAResponse = ApiResponse<null>;
export type ListSLAResponse = ApiResponse<TicketCategorySLA[]>;
