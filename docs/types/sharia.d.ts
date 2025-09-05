import type { APIResponse, Rfc3339String } from './index';

export interface ShariaFinancing { id: number; tenant_id: number; member_id: number; akad_type: string; amount: number; margin: number; tenor: number; status: 'pending' | 'approved' | 'disbursed'; created_at: Rfc3339String }
export interface ShariaInstallment { id: number; financing_id: number; due_date: Rfc3339String; amount: number; paid_amount: number; status: 'unpaid' | 'paid'; penalty: number; paid_at?: Rfc3339String }

export interface ApplicationRequest { akad_type: string; amount: number; margin: number; tenor: number }
export interface ApplyRequest extends ApplicationRequest { member_id: number }
export interface DisburseRequest { method: string }
export interface PaymentRequest { amount: number; date: Rfc3339String; method: string }

export type ApplyShariaFinancingResponse = ShariaFinancing;
export type ApproveShariaFinancingResponse = ShariaFinancing;
export type DisburseShariaFinancingResponse = void;
export type ListShariaInstallmentsResponse = APIResponse<ShariaInstallment[]>;
export type PayShariaInstallmentResponse = ShariaInstallment;
export type ShariaReleaseLetterResponse = APIResponse<{ message: string }>;

