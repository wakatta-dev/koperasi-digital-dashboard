/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type RAT = {
  id: number;
  tenant_id: number;
  year: number;
  date: Rfc3339String;
  agenda: string;
  status: 'scheduled' | 'completed';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type VotingItem = {
  id: number;
  rat_id: number;
  question: string;
  type: string;
  options?: Record<string, unknown>;
  open_at: Rfc3339String;
  close_at: Rfc3339String;
};

export type VotingResult = {
  item_id: number;
  total_votes: number;
  summary: Array<{ option: string; count: number; percentage: number }>;
};

export type RATReport = {
  rat: RAT;
  attendance: {
    total_invited: number;
    attended: number;
  };
  votes: VotingResult[];
  documents: string[];
};

export type RATDocument = {
  id: number;
  rat_id: number;
  type: string;
  file_url: string;
};

export type CreateRATRequest = {
  year: number;
  date: Rfc3339String;
  agenda?: string;
};

export type NotifyRATRequest = {
  message: string;
  channels?: string[];
  email_recipients?: string[];
};

export type UploadDocumentRequest = {
  type: string;
  data: string;
};

export type CreateVotingItemRequest = {
  question: string;
  type: string;
  options?: Record<string, unknown> | string[];
  open_at: Rfc3339String;
  close_at: Rfc3339String;
};

export type VoteRequest = {
  member_id: number;
  selected_option: string;
};

export type RATResponse = ApiResponse<RAT>;
export type RATStatusResponse = ApiResponse<{ status: string }>;
export type RATDocumentResponse = ApiResponse<{ status: string }>;
export type RATDocumentListResponse = ApiResponse<RATDocument[]>;
export type VotingItemResponse = ApiResponse<VotingItem>;
export type VotingResultResponse = ApiResponse<VotingResult>;
export type RATReportResponse = ApiResponse<RATReport>;
export type RATHistoryResponse = ApiResponse<RAT[]>;
