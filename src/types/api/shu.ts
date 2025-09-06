/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface YearlySHU { id: number; tenant_id: number; year: number; total_shu: number; status: string; created_at: Rfc3339String }
export interface SHUDistribution { id: number; shu_year_id: number; member_id: number; contribution_savings: number; contribution_participation: number; distributed_amount: number; distributed_at?: Rfc3339String }

export interface YearlySHURequest { year: number; total_shu: number }
export interface DistributionRequest { method: string; description: string }

export type InputYearlySHUResponse = ApiResponse<YearlySHU>;
export type SimulateSHUResponse = ApiResponse<SHUDistribution[]>;
export type DistributeSHUResponse = ApiResponse<{ status: string }>;
export type ListYearlySHUResponse = ApiResponse<YearlySHU[]>;
export type MemberSHUHistoryResponse = ApiResponse<SHUDistribution[]>;

