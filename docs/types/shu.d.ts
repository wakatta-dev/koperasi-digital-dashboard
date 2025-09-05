import type { APIResponse, Rfc3339String } from './index';

export interface YearlySHU { id: number; tenant_id: number; year: number; total_shu: number; status: string; created_at: Rfc3339String }
export interface SHUDistribution { id: number; shu_year_id: number; member_id: number; contribution_savings: number; contribution_participation: number; distributed_amount: number; distributed_at?: Rfc3339String }

export interface YearlySHURequest { year: number; total_shu: number }
export interface DistributionRequest { method: string; description: string }

export type InputYearlySHUResponse = APIResponse<YearlySHU>;
export type SimulateSHUResponse = APIResponse<SHUDistribution[]>;
export type DistributeSHUResponse = APIResponse<{ status: string }>;
export type ListYearlySHUResponse = APIResponse<YearlySHU[]>;
export type MemberSHUHistoryResponse = APIResponse<SHUDistribution[]>;

