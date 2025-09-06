/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export interface LoanApplication { id: number; tenant_id: number; member_id: number; amount: number; tenor: number; rate: number; purpose?: string; status: 'pending' | 'approved' | 'disbursed'; created_at: Rfc3339String }
export interface LoanInstallment { id: number; loan_id: number; due_date: Rfc3339String; amount: number; paid_amount: number; status: 'unpaid' | 'paid'; penalty: number; paid_at?: Rfc3339String }

export interface ApplicationRequest { amount: number; tenor: number; rate: number; purpose?: string }
export interface ApplyRequest extends ApplicationRequest { member_id: number }
export interface DisburseRequest { method: string }
export interface PaymentRequest { amount: number; date: Rfc3339String; method: string }

export type ApplyLoanResponse = LoanApplication;
export type ApproveLoanResponse = LoanApplication;
export type DisburseLoanResponse = void;
export type ListInstallmentsResponse = ApiResponse<LoanInstallment[]>;
export type PayInstallmentResponse = LoanInstallment;
export type ReleaseLetterResponse = ApiResponse<{ message: string }>;

