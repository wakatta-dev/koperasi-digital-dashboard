/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface Ticket {
  id: string;
  tenant_id: number;
  user_id: number;
  member_id?: number;
  agent_id?: number;
  title: string;
  category: 'billing' | 'technical' | 'account' | 'service';
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  escalation_level: number;
  description: string;
  attachment_url?: string;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface TicketReply { id: string; ticket_id: string; user_id: number; message: string; attachment_url?: string; created_at: Rfc3339String }
export interface TicketActivityLog { id: string; ticket_id: string; actor_id: number; action: string; message?: string; created_at: Rfc3339String }
export interface TicketCategorySLA { category: string; sla_response_minutes: number; sla_resolution_minutes: number }

export interface CreateTicketRequest { title: string; category: Ticket['category']; priority: Ticket['priority']; description: string; attachment_url?: string }
export interface AddReplyRequest { message: string; attachment_url?: string }
export interface UpdateTicketRequest { status?: Ticket['status']; agent_id?: number }
export interface SLARequest { category: string; sla_response_minutes: number; sla_resolution_minutes: number }

export type CreateTicketResponse = ApiResponse<Ticket>;
export type ListTicketsResponse = ApiResponse<Ticket[]>;
export type GetTicketResponse = ApiResponse<Ticket>;
export type AddReplyResponse = ApiResponse<TicketReply>;
export type UpdateTicketResponse = ApiResponse<Ticket>;
export type ListActivitiesResponse = ApiResponse<TicketActivityLog[]>;
export type ListRepliesResponse = ApiResponse<TicketReply[]>;
export type SetSLAResponse = ApiResponse<null>;
export type ListSLAResponse = ApiResponse<TicketCategorySLA[]>;
