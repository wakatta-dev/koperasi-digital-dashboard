import type { APIResponse, Rfc3339String } from './index';

export type SessionStatus = 'OPEN' | 'CLOSED';

export interface ChatSession {
  id: string;
  tenant_id: number;
  agent_id?: number;
  status: SessionStatus;
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender_id: number;
  message: string;
  created_at: Rfc3339String;
}

export interface StartSessionRequest { agent_id?: number }
export interface SendMessageRequest { message: string }

export type StartSessionResponse = APIResponse<ChatSession>;
export type SendMessageResponse = APIResponse<ChatMessage>;
export type ListMessagesResponse = APIResponse<ChatMessage[]>;

