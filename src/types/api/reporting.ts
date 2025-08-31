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

