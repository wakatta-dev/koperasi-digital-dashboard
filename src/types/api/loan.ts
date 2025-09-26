/** @format */

import type { ApiResponse, Rfc3339String } from './common';

export type LoanApplication = {
  id: number;
  tenant_id: number;
  member_id: number;
  amount: number;
  tenor: number;
  rate: number;
  purpose?: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed';
  created_at: Rfc3339String;
  installments: LoanInstallment[];
};

export type LoanInstallment = {
  id: number;
  loan_id: number;
  due_date: Rfc3339String;
  amount: number;
  paid_amount: number;
  status: 'unpaid' | 'paid' | 'overdue';
  penalty: number;
  paid_at?: Rfc3339String;
};

export type LoanReleaseLetter = {
  id: number;
  loan_id: number;
  content: string;
  generated_at: Rfc3339String;
};

export type ApplyRequest = {
  member_id: number;
  amount: number;
  tenor: number;
  rate: number;
  purpose?: string;
};

export type DisbursementRequest = {
  method: string;
};

export type PaymentRequest = {
  amount: number;
  date: Rfc3339String;
  method: string;
};

export type LoanApplicationResponse = ApiResponse<LoanApplication>;
export type LoanInstallmentListResponse = ApiResponse<LoanInstallment[]>;
export type LoanInstallmentResponse = ApiResponse<LoanInstallment>;
export type LoanReleaseLetterResponse = ApiResponse<LoanReleaseLetter>;
export type LoanReleaseLetterHistoryResponse = ApiResponse<LoanReleaseLetter[]>;
