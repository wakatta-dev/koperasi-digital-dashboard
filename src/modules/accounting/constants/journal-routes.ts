/** @format */

export const ACCOUNTING_JOURNAL_ROUTES = {
  index: "/bumdes/accounting/journal",
  create: "/bumdes/accounting/journal/new",
  detail: (journalNumber: string) =>
    `/bumdes/accounting/journal/${encodeURIComponent(journalNumber)}`,
  auditLog: "/bumdes/accounting/journal/audit-log",
} as const;

export const ACCOUNTING_JOURNAL_FLOW_ORDER = [
  "Journal List",
  "New Journal",
  "Journal Detail",
  "Audit Log",
] as const;
