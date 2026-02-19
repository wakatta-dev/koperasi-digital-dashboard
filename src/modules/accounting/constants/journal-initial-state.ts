/** @format */

import type {
  JournalAuditLogFilterValue,
  JournalAuditLogRow,
  JournalAuditSummaryCounter,
  JournalDetailGeneralInformation,
  JournalDetailHeader,
  JournalDetailIntegrity,
  JournalDetailItem,
  JournalEntriesFilterValue,
  JournalEntriesPagination,
  JournalEntriesSummaryCard,
  JournalEntriesTableRow,
  JournalInlineAuditItem,
  JournalPeriodLockSelection,
  ManualJournalMetadata,
} from "../types/journal";

function currentPeriodLockSelection(): JournalPeriodLockSelection {
  const now = new Date();
  return {
    month: String(now.getMonth() + 1),
    year: String(now.getFullYear()),
  };
}

export const JOURNAL_INITIAL_ENTRIES_SUMMARY_CARDS: JournalEntriesSummaryCard[] = [];
export const JOURNAL_INITIAL_ENTRIES_ROWS: JournalEntriesTableRow[] = [];
export const JOURNAL_INITIAL_ENTRIES_FILTERS: JournalEntriesFilterValue = {
  q: "",
  date: "all_dates",
  type: "all_types",
  status: "all_status",
};
export const JOURNAL_INITIAL_ENTRIES_PAGINATION: JournalEntriesPagination = {
  page: 1,
  per_page: 20,
  total_items: 0,
};
export const JOURNAL_INITIAL_LOCK_PERIOD: JournalPeriodLockSelection = currentPeriodLockSelection();

export const JOURNAL_INITIAL_NEW_ENTRY_METADATA: ManualJournalMetadata = {
  reference_number: "",
  journal_reference: "",
  journal_date: "",
};

export const JOURNAL_INITIAL_INLINE_AUDIT_ROWS: JournalInlineAuditItem[] = [];

export const JOURNAL_INITIAL_DETAIL_HEADER: JournalDetailHeader = {
  journal_number: "",
  status: "Draft",
  posted_label: "",
};

export const JOURNAL_INITIAL_DETAIL_GENERAL_INFORMATION: JournalDetailGeneralInformation = {
  reference_number: "",
  journal_date: "",
  partner_entity: "",
  journal_name: "",
};

export const JOURNAL_INITIAL_DETAIL_ITEMS: JournalDetailItem[] = [];

export const JOURNAL_INITIAL_DETAIL_TOTALS = {
  debit_amount: "0.00",
  credit_amount: "0.00",
} as const;

export const JOURNAL_INITIAL_DETAIL_INTEGRITY: JournalDetailIntegrity = {
  balanced_label: "",
  immutable_label: "",
  last_modified_label: "",
};

export const JOURNAL_INITIAL_AUDIT_LOG_FILTERS: JournalAuditLogFilterValue = {
  q: "",
  user: "all",
  module: "all",
  date_from: "",
  date_to: "",
  journal_number: "",
};

export const JOURNAL_INITIAL_AUDIT_LOG_ROWS: JournalAuditLogRow[] = [];

export const JOURNAL_INITIAL_AUDIT_LOG_SUMMARY_COUNTERS: JournalAuditSummaryCounter[] = [
  { key: "created", label: "Created", value: "0", tone: "emerald" },
  { key: "edited", label: "Edited", value: "0", tone: "amber" },
  { key: "deleted", label: "Deleted", value: "0", tone: "red" },
  { key: "posted", label: "Posted", value: "0", tone: "blue" },
];
