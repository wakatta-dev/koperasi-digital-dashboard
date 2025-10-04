/** @format */

import type { ApiResponse, Rfc3339String } from './common';

// Koperasi financial reports (balance sheet, profit & loss, cash flow)
export type BalanceSheetReport = {
  assets: {
    current: number;
    fixed: number;
    total: number;
  };
  liabilities: {
    short_term: number;
    long_term: number;
    total: number;
  };
  equity: number;
  data: Record<string, number>;
};

export type ProfitLossReport = {
  revenue: number;
  expense: number;
  net_income: number;
  breakdown: Array<{ account: string; amount: number }>;
};

export type CashflowReport = {
  operating: number;
  investing: number;
  financing: number;
  closing_balance: number;
  lines: Array<{ account: string; amount: number }>;
};

export type BalanceSheetReportResponse = ApiResponse<BalanceSheetReport>;
export type ProfitLossReportResponse = ApiResponse<ProfitLossReport>;
export type CashflowReportResponse = ApiResponse<CashflowReport>;

// Legacy/vendor report types retained for compatibility
export type FinanceByPeriod = {
  period: string;
  income: number;
  expense: number;
};

export type FinanceReportResponse = {
  total_income: number;
  total_expense: number;
  ending_balance: number;
  by_period: FinanceByPeriod[];
};

export type OverdueInvoiceResponse = {
  id: number;
  number: string;
  tenant_id: number;
  total: number;
  due_date: Rfc3339String;
};

export type BillingStatusDetail = {
  paid: number;
  pending: number;
  overdue: number;
};

export type BillingRevenueDetail = {
  outstanding: number;
  subscription: number;
};

export type BillingReportResponse = {
  total_invoices: number;
  status_detail: BillingStatusDetail;
  revenue: BillingRevenueDetail;
  overdue_invoices: OverdueInvoiceResponse[];
};

export type CashflowChartData = {
  label: string;
  cash_in: number;
  cash_out: number;
};

export type ProfitLossChartData = {
  label: string;
  profit: number;
  loss: number;
};

export type BalanceSheetBreakdown = {
  account: string;
  amount: number;
};

export type LegacyBalanceSheetReportResponse = {
  total_assets: number;
  total_liabilities: number;
  total_equity: number;
  breakdown: BalanceSheetBreakdown[];
};

export type ReportArchive = {
  id: number;
  tenant_id: number;
  type: string;
  period_start: Rfc3339String;
  period_end: Rfc3339String;
  file_url: string;
  created_at: Rfc3339String;
};

export type ReportExportMeta = {
  id: number;
  report_type: string;
  params: string;
  file_url: string;
  created_at: Rfc3339String;
};

export type VendorRecurringRevenuePoint = {
  period: string;
  mrr: number;
  arr: number;
};

export type VendorFinancialReport = {
  totals: {
    mrr: number;
    arr: number;
  };
  series: VendorRecurringRevenuePoint[];
};
export type VendorUsageReport = Record<string, unknown>;

export type GetFinanceReportResponse = ApiResponse<FinanceReportResponse>;
export type GetBillingReportResponse = ApiResponse<BillingReportResponse>;
export type GetLegacyCashflowReportResponse = ApiResponse<{ total_cash_in: number; total_cash_out: number; data: CashflowChartData[] }>;
export type GetLegacyProfitLossReportResponse = ApiResponse<{ net_profit: number; data: ProfitLossChartData[] }>;
export type GetLegacyBalanceSheetReportResponse = ApiResponse<LegacyBalanceSheetReportResponse>;
export type GetReportHistoryResponse = ApiResponse<ReportArchive[]>;
export type GetFinancialReportResponse = ApiResponse<VendorFinancialReport>;
export type GetUsageReportResponse = ApiResponse<VendorUsageReport>;
export type ListVendorReportExportsResponse = ApiResponse<ReportExportMeta[]>;
