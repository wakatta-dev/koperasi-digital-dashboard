/** @format */

export type JournalSummaryCardTone = "warning" | "success" | "danger";

export type JournalEntriesSummaryCard = {
  key: "draft_entries" | "posted_entries" | "locked_periods";
  label: string;
  value: string;
  helper_value?: string;
  helper_text: string;
  tone: JournalSummaryCardTone;
};

export type JournalEntryStatus = "Draft" | "Posted" | "Locked" | "Reversed";

export type JournalEntryType = "sales" | "purchase" | "cash" | "general";

export type JournalEntriesTableRow = {
  journal_number: string;
  journal_date: string;
  journal_date_value: string;
  journal_name: string;
  journal_type: JournalEntryType;
  partner: string;
  debit_amount: string;
  credit_amount: string;
  status: JournalEntryStatus;
};

export type JournalEntriesFilterValue = {
  q: string;
  date: "all_dates" | "this_month" | "last_month" | "this_year";
  type: "all_types" | JournalEntryType;
  status: "all_status" | "draft" | "posted" | "locked" | "reversed";
};

export type JournalEntriesPagination = {
  page: number;
  per_page: number;
  total_items: number;
};

export type JournalPeriodLockSelection = {
  month: string;
  year: string;
};
