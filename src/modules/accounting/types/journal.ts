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

export type ManualJournalMetadata = {
  reference_number: string;
  journal_reference: string;
  journal_date: string;
};

export type ManualJournalLineItem = {
  line_id: string;
  account_code: string;
  label_description: string;
  debit_amount: number;
  credit_amount: number;
};

export type ManualJournalAccountOption = {
  value: string;
  label: string;
};

export type JournalInlineAuditAction = "Edited" | "Draft Saved" | "Created";

export type JournalInlineAuditItem = {
  timestamp: string;
  user_initial: string;
  user_name: string;
  action: JournalInlineAuditAction;
  details: string;
};

export type JournalDetailStatus = "Draft" | "Posted" | "Locked" | "Reversed";

export type JournalDetailHeader = {
  journal_number: string;
  status: JournalDetailStatus;
  posted_label: string;
};

export type JournalDetailGeneralInformation = {
  reference_number: string;
  journal_date: string;
  partner_entity: string;
  journal_name: string;
};

export type JournalDetailItem = {
  account_name: string;
  account_category: string;
  label: string;
  debit_amount: string;
  credit_amount: string;
};

export type JournalDetailIntegrity = {
  balanced_label: string;
  immutable_label: string;
  last_modified_label: string;
};

export type JournalAuditModule = "Journal" | "Invoice" | "Vendor Bill" | "Payment" | "Setting";

export type JournalAuditAction = "Posted" | "Edited" | "Created" | "Deleted" | "Locked";

export type JournalAuditLogRow = {
  timestamp_date: string;
  timestamp_time: string;
  user_initial: string;
  user_name: string;
  module: JournalAuditModule;
  action: JournalAuditAction;
  reference_no: string;
  change_details: string;
};

export type JournalAuditLogFilterValue = {
  q: string;
  user: "all" | "shadcn" | "jdoe" | "system";
  module: "all" | "journal" | "invoice" | "bill" | "payment" | "setting";
  date_from: string;
  date_to: string;
  journal_number: string;
};

export type JournalAuditSummaryCounter = {
  key: "created" | "edited" | "deleted" | "posted";
  label: string;
  value: string;
  tone: "emerald" | "amber" | "red" | "blue";
};
