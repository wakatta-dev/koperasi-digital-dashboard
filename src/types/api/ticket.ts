/** @format */

export interface Ticket {
  id: string;
  tenant_id: number;
  user_id: number;
  agent_id?: number | null;
  title: string;
  category: "billing" | "technical" | "access" | "other";
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved" | "closed";
  description: string;
  attachment_url?: string | null;
  created_at: string;
  updated_at: string;
  // Detail endpoint may include replies
  replies?: TicketReply[];
}

export interface TicketReply {
  id: string;
  ticket_id: string;
  user_id: number;
  message: string;
  attachment_url?: string | null;
  created_at: string;
}

