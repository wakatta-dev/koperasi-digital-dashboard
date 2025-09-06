/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface RAT { id: number; tenant_id: number; year: number; date: Rfc3339String; agenda?: string; created_at: Rfc3339String }
export interface RATDocument { id: number; rat_id: number; type: string; file_url: string }
export interface VotingItem { id: number; rat_id: number; question: string; type: string; options?: string[]; open_at: Rfc3339String; close_at: Rfc3339String }
export interface VotingResult { item_id: number; counts: Record<string, number>; total: number }

export interface CreateRATRequest { year: number; date: Rfc3339String; agenda?: string }
export interface NotifyRequest { message: string }
export interface UploadDocumentRequest { type: string; data: string }
export interface CreateVotingItemRequest { question: string; type: string; options?: string[]; open_at: Rfc3339String; close_at: Rfc3339String }
export interface VoteRequest { member_id: number; selected_option: string }

export type CreateRATResponse = ApiResponse<RAT>;
export type NotifyRATResponse = ApiResponse<null>;
export type UploadRATDocumentResponse = ApiResponse<null>;
export type CreateVotingItemResponse = ApiResponse<VotingItem>;
export type VoteResponse = ApiResponse<{ status: string }>;
export type GetVotingResultResponse = ApiResponse<VotingResult>;
export type RATHistoryResponse = ApiResponse<RAT[]>;

