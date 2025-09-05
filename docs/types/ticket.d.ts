import type { APIResponse, Rfc3339String } from './index';

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

export type CreateTicketResponse = APIResponse<Ticket>;
export type ListTicketsResponse = APIResponse<Ticket[]>;
export type GetTicketResponse = APIResponse<Ticket>;
export type AddReplyResponse = APIResponse<TicketReply>;
export type UpdateTicketResponse = APIResponse<Ticket>;
export type ListActivitiesResponse = APIResponse<TicketActivityLog[]>;
export type ListRepliesResponse = APIResponse<TicketReply[]>;
export type SetSLAResponse = APIResponse<null>;
export type ListSLAResponse = APIResponse<TicketCategorySLA[]>;

