import type { APIResponse, Rfc3339String } from './index';

export interface FinanceByPeriod { period: string; income: number; expense: number }
export interface FinanceReportResponse { total_income: number; total_expense: number; ending_balance: number; by_period: FinanceByPeriod[] }

export interface OverdueInvoiceResponse { id: number; number: string; tenant_id: number; total: number; due_date: Rfc3339String }
export interface BillingStatusDetail { paid: number; pending: number; overdue: number }
export interface BillingRevenueDetail { outstanding: number; subscription: number }
export interface BillingReportResponse { total_invoices: number; status_detail: BillingStatusDetail; revenue: BillingRevenueDetail; overdue_invoices: OverdueInvoiceResponse[] }

export interface CashflowChartData { label: string; cash_in: number; cash_out: number }
export interface CashflowReportResponse { total_cash_in: number; total_cash_out: number; data: CashflowChartData[] }

export interface ProfitLossChartData { label: string; profit: number; loss: number }
export interface ProfitLossReportResponse { net_profit: number; data: ProfitLossChartData[] }

export interface BalanceSheetBreakdown { account: string; amount: number }
export interface BalanceSheetReportResponse { total_assets: number; total_liabilities: number; total_equity: number; breakdown: BalanceSheetBreakdown[] }

export interface ReportArchive { id: number; tenant_id: number; type: string; period_start: Rfc3339String; period_end: Rfc3339String; file_url: string; created_at: Rfc3339String }
export interface ReportExport { id: number; report_type: string; params: string; file_url: string; created_at: Rfc3339String }

export interface FinancialReport { [k: string]: unknown }
export interface UsageReport { [k: string]: unknown }

export type GetFinanceReportResponse = APIResponse<FinanceReportResponse>;
export type GetBillingReportResponse = APIResponse<BillingReportResponse>;
export type GetCashflowReportResponse = APIResponse<CashflowReportResponse>;
export type GetProfitLossReportResponse = APIResponse<ProfitLossReportResponse>;
export type GetBalanceSheetReportResponse = APIResponse<BalanceSheetReportResponse>;
export type GetReportHistoryResponse = APIResponse<ReportArchive[]>;
export type GetFinancialReportResponse = APIResponse<FinancialReport>;
export type GetUsageReportResponse = APIResponse<UsageReport>;
export type ListVendorReportExportsResponse = APIResponse<ReportExport[]>;

