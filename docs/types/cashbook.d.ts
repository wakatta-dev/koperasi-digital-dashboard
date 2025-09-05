import type { Rfc3339String } from './index';

export interface CashEntry {
  id: number;
  tenant_id: number;
  source: string;
  amount: number;
  type: 'in' | 'out';
  description: string;
  created_at: Rfc3339String;
}

export interface CashSummary { total_in: number; total_out: number }

export interface ManualEntryRequest { source: string; amount: number; type: 'in' | 'out'; description?: string }
export interface CashExportRequest { report_type: string }

export type CreateManualCashResponse = CashEntry;
export type GetCashSummaryResponse = CashSummary;

