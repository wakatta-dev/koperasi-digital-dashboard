/** @format */

export interface FinanceReportResponse {
  total_income: number;
  total_expense: number;
  ending_balance: number;
  by_period: Array<{
    month: string; // YYYY-MM
    income: number;
    expense: number;
  }>;
}

export interface BillingReportResponse {
  total_invoices: number;
  total_paid: number;
  total_pending: number;
  outstanding_amount: number;
  overdue_invoices: Array<{
    id: number;
    number: string;
    tenant_id: number;
    total: number;
    due_date: string;
  }>;
}

// Additional report DTOs based on docs/modules/reporting.md
export interface CashflowReportResponse {
  total_cash_in: number;
  total_cash_out: number;
  data: Array<{
    label: string;
    cash_in: number;
    cash_out: number;
  }>;
}

export interface ProfitLossReportResponse {
  net_profit: number;
  data: Array<{
    label: string;
    profit: number;
    loss: number;
  }>;
}

export interface BalanceSheetReportResponse {
  total_assets: number;
  total_liabilities: number;
  breakdown: Array<{
    account: string;
    amount: number;
  }>;
}

// Vendor reports (minimal DTOs based on docs/test-case/vendor/06_reporting.md)
export interface VendorFinancialReport {
  total_income: number;
  total_expense: number;
  ending_balance?: number;
  by_period?: Array<{ label: string; income: number; expense: number }>;
}

export interface VendorUsageReport {
  total_events?: number;
  data: Array<{
    tenant_id?: number;
    module?: string;
    count: number;
    label?: string;
  }>;
}

export interface ReportExportMeta {
  id: number;
  report_type: string;
  format: string; // pdf|xlsx
  created_at: string;
  status?: string;
}
