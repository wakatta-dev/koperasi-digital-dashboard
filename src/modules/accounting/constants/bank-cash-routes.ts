/** @format */

export const BANK_CASH_ROUTES = {
  index: "/bumdes/accounting/bank-cash",
  reconciliation: "/bumdes/accounting/bank-cash/reconciliation",
  overview: "/bumdes/accounting/bank-cash/overview",
  accountTransactions: (accountId: string) =>
    `/bumdes/accounting/bank-cash/accounts/${encodeURIComponent(accountId)}/transactions`,
} as const;
