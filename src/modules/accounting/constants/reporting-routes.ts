/** @format */

export const ACCOUNTING_REPORTING_ROUTES = {
  catalog: "/bumdes/accounting/reporting",
  profitLoss: "/bumdes/accounting/reporting/profit-loss",
  cashFlow: "/bumdes/accounting/reporting/cash-flow",
  balanceSheet: "/bumdes/accounting/reporting/balance-sheet",
  profitLossComparative: "/bumdes/accounting/reporting/p-and-l-comparative",
  trialBalance: "/bumdes/accounting/reporting/trial-balance",
  generalLedger: "/bumdes/accounting/reporting/general-ledger",
  accountLedger: "/bumdes/accounting/reporting/account-ledger",
} as const;

export const ACCOUNTING_REPORTING_FLOW_ORDER = [
  "Reporting Catalog",
  "Profit and Loss",
  "Cash Flow Statement",
  "Balance Sheet",
  "P&L Comparative",
  "Trial Balance",
  "General Ledger",
  "Account Ledger",
] as const;
