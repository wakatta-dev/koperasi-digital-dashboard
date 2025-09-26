/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type YearlySHU = {
  id: number;
  tenant_id: number;
  year: number;
  total_shu: number;
  allocation_savings: number;
  allocation_participation: number;
  status: 'draft' | 'distributed';
  created_at: Rfc3339String;
  updated_at: Rfc3339String;
};

export type SHUDistribution = {
  id: number;
  year: number;
  member_id: number;
  member_name: string;
  simpanan: number;
  partisipasi: number;
  amount: number;
  status: 'simulated' | 'allocated';
  created_at: Rfc3339String;
};

export type YearlySHURequest = {
  year: number;
  total_shu: number;
  allocation_savings?: number;
  allocation_participation?: number;
};

export type DistributionRequest = {
  method: string;
  description?: string;
};

export type YearlySHUResponse = ApiResponse<YearlySHU>;
export type SHUSimulationResponse = ApiResponse<SHUDistribution[]>;
export type SHUDistributionResponse = ApiResponse<{ status: string }>;
export type SHUHistoryResponse = ApiResponse<YearlySHU[]>;
export type SHUMemberHistoryResponse = ApiResponse<SHUDistribution[]>;
