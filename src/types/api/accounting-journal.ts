/** @format */

export type AccountingJournalPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingJournalStatus = "Draft" | "Posted" | "Locked" | "Reversed";

export type AccountingJournalSummaryCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
  tone?: "primary" | "warning" | "success" | "danger";
};

export type AccountingJournalOverviewResponse = {
  cards: AccountingJournalSummaryCard[];
  period_lock: {
    year: number;
    month: number;
    status: "Unlocked" | "Locked";
    locked_by?: string;
    locked_at?: string;
  };
};

export type AccountingJournalEntriesQuery = {
  q?: string;
  date?: string;
  type?: string;
  status?: string;
  sort?: string;
  page?: number;
  per_page?: number;
};

export type AccountingJournalEntryListItem = {
  journal_number: string;
  journal_date: string;
  journal_name: string;
  journal_type?: string;
  partner: string;
  debit_amount: number;
  credit_amount: number;
  status: AccountingJournalStatus;
};

export type AccountingJournalEntriesResponse = {
  items: AccountingJournalEntryListItem[];
  summary: {
    draft_entries: number;
    posted_entries: number;
    locked_period_label: string;
  };
  pagination: AccountingJournalPagination;
};

export type AccountingJournalEntryLineDraft = {
  line_no: number;
  account_code: string;
  label_description?: string;
  debit_amount: number;
  credit_amount: number;
};

export type AccountingJournalCreateEntryRequest = {
  journal_date: string;
  journal_name: string;
  partner_entity?: string;
  reference_number?: string;
  lines: AccountingJournalEntryLineDraft[];
  save_mode: "draft" | "post";
};

export type AccountingJournalCreateEntryResponse = {
  journal_number: string;
  status: AccountingJournalStatus;
  total_debit_amount: number;
  total_credit_amount: number;
};

export type AccountingJournalUpdateEntryRequest = Omit<
  AccountingJournalCreateEntryRequest,
  "save_mode"
> & {
  save_mode?: "draft" | "post";
};

export type AccountingJournalUpdateEntryResponse = {
  journal_number: string;
  status: AccountingJournalStatus;
  updated_at: string;
};

export type AccountingJournalDetailResponse = {
  header: {
    journal_number: string;
    status: AccountingJournalStatus;
    posted_at?: string;
    posted_by?: string;
  };
  general_information: {
    reference_number: string;
    journal_date: string;
    partner_entity: string;
    journal_name: string;
  };
  line_items: Array<{
    account_code: string;
    account_name: string;
    account_category?: string;
    label: string;
    debit_amount: number;
    credit_amount: number;
  }>;
  totals: {
    debit_amount: number;
    credit_amount: number;
  };
  integrity_flags: {
    balanced_entry: boolean;
    immutable_record: boolean;
    last_modified_label?: string;
  };
};

export type AccountingJournalPostEntryRequest = {
  note?: string;
};

export type AccountingJournalPostEntryResponse = {
  journal_number: string;
  status: "Posted";
  posted_at: string;
  detail_href: string;
};

export type AccountingJournalReverseEntryRequest = {
  reason?: string;
};

export type AccountingJournalReverseEntryResponse = {
  journal_number: string;
  status: "Reversed";
  reversed_at: string;
};

export type AccountingJournalPdfMetadataResponse = {
  journal_number: string;
  download_url: string;
  expires_at: string;
};

export type AccountingJournalEntryAuditLogsQuery = {
  page?: number;
  per_page?: number;
};

export type AccountingJournalEntryAuditLogItem = {
  timestamp: string;
  user: string;
  action: string;
  details: string;
};

export type AccountingJournalEntryAuditLogsResponse = {
  items: AccountingJournalEntryAuditLogItem[];
  pagination: AccountingJournalPagination;
};

export type AccountingJournalAuditLogsQuery = {
  q?: string;
  user?: string;
  module?: string;
  date_from?: string;
  date_to?: string;
  journal_number?: string;
  page?: number;
  per_page?: number;
};

export type AccountingJournalAuditLogItem = {
  timestamp: string;
  user: string;
  module: string;
  action: string;
  reference_no: string;
  change_details: string;
};

export type AccountingJournalAuditLogsResponse = {
  items: AccountingJournalAuditLogItem[];
  summary_counters: {
    created: number;
    edited: number;
    deleted: number;
    posted: number;
  };
  pagination: AccountingJournalPagination;
};

export type AccountingJournalCreatePeriodLockRequest = {
  year: number;
  month: number;
  note?: string;
};

export type AccountingJournalCreatePeriodLockResponse = {
  year: number;
  month: number;
  status: "Locked";
  locked_at: string;
};

export type AccountingJournalCurrentPeriodLockQuery = {
  year?: number;
  month?: number;
};

export type AccountingJournalCurrentPeriodLockResponse = {
  year: number;
  month: number;
  status: "Unlocked" | "Locked";
  locked_by?: string;
  locked_at?: string;
};
