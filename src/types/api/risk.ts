/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface RiskRule { id: number; tenant_id: number; factor: string; weight: number; threshold: number; created_at: Rfc3339String }
export interface RiskResult { id: number; tenant_id: number; member_id: number; score: number; decision: string; details: string; created_at: Rfc3339String }

export interface ScoreRequest { member_id: number }
export interface RuleRequest { factor: string; weight: number; threshold: number }

export type ListRiskRulesResponse = ApiResponse<RiskRule[]>;
export type CreateRiskRuleResponse = ApiResponse<RiskRule>;
export type DeleteRiskRuleResponse = ApiResponse<null>;

