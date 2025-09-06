/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface ShariaFinancing { id: number; tenant_id: number; member_id: number; akad_type: string; amount: number; margin: number; tenor: number; status: 'pending' | 'approved' | 'disbursed'; created_at: Rfc3339String }
export interface ShariaInstallment { id: number; financing_id: number; due_date: Rfc3339String; amount: number; paid_amount: number; status: 'unpaid' | 'paid'; penalty: number; paid_at?: Rfc3339String }

export interface ShariaApplicationRequest { akad_type: string; amount: number; margin: number; tenor: number }
export interface ShariaApplyRequest extends ShariaApplicationRequest { member_id: number }
export interface ShariaDisburseRequest { method: string }
export interface ShariaPaymentRequest { amount: number; date: Rfc3339String; method: string }

export type ApplyShariaFinancingResponse = ShariaFinancing;
export type ApproveShariaFinancingResponse = ShariaFinancing;
export type DisburseShariaFinancingResponse = void;
export type ListShariaInstallmentsResponse = ApiResponse<ShariaInstallment[]>;
export type PayShariaInstallmentResponse = ShariaInstallment;
export type ShariaReleaseLetterResponse = ApiResponse<{ message: string }>;
