/** @format */

import type {
  JournalInlineAuditItem,
  JournalEntriesFilterValue,
  JournalEntriesSummaryCard,
  JournalEntriesTableRow,
  ManualJournalAccountOption,
  ManualJournalLineItem,
  ManualJournalMetadata,
  JournalPeriodLockSelection,
} from "../types/journal";

export const JOURNAL_ENTRIES_SUMMARY_CARDS: JournalEntriesSummaryCard[] = [
  {
    key: "draft_entries",
    label: "Draft Entries",
    value: "12",
    helper_value: "Action Required",
    helper_text: "Review needed",
    tone: "warning",
  },
  {
    key: "posted_entries",
    label: "Posted Entries",
    value: "1,248",
    helper_value: "+45",
    helper_text: "this month",
    tone: "success",
  },
  {
    key: "locked_periods",
    label: "Locked Periods",
    value: "Oct 2023",
    helper_text: "Last closed period",
    tone: "danger",
  },
];

export const JOURNAL_ENTRIES_ROWS: JournalEntriesTableRow[] = [
  {
    journal_number: "JE/2023/0143",
    journal_date: "Nov 14, 2023",
    journal_date_value: "2023-11-14",
    journal_name: "Customer Invoice",
    journal_type: "sales",
    partner: "CV. Pelanggan Setia",
    debit_amount: "8,250,000",
    credit_amount: "8,250,000",
    status: "Draft",
  },
  {
    journal_number: "JE/2023/0142",
    journal_date: "Nov 14, 2023",
    journal_date_value: "2023-11-14",
    journal_name: "Vendor Payment",
    journal_type: "purchase",
    partner: "PT. Supplier Jaya",
    debit_amount: "15,000,000",
    credit_amount: "15,000,000",
    status: "Posted",
  },
  {
    journal_number: "JE/2023/0138",
    journal_date: "Nov 12, 2023",
    journal_date_value: "2023-11-12",
    journal_name: "Office Supplies",
    journal_type: "general",
    partner: "Toko ATK Abadi",
    debit_amount: "450,000",
    credit_amount: "450,000",
    status: "Posted",
  },
  {
    journal_number: "JE/2023/0135",
    journal_date: "Nov 10, 2023",
    journal_date_value: "2023-11-10",
    journal_name: "Salary Payment",
    journal_type: "cash",
    partner: "Internal",
    debit_amount: "85,000,000",
    credit_amount: "85,000,000",
    status: "Posted",
  },
  {
    journal_number: "JE/2023/0110",
    journal_date: "Oct 31, 2023",
    journal_date_value: "2023-10-31",
    journal_name: "Monthly Closing",
    journal_type: "general",
    partner: "System",
    debit_amount: "125,000,000",
    credit_amount: "125,000,000",
    status: "Locked",
  },
];

export const JOURNAL_ENTRIES_DEFAULT_FILTERS: JournalEntriesFilterValue = {
  q: "",
  date: "all_dates",
  type: "all_types",
  status: "all_status",
};

export const JOURNAL_ENTRIES_DEFAULT_LOCK_PERIOD: JournalPeriodLockSelection = {
  month: "10",
  year: "2023",
};

export const JOURNAL_ENTRIES_BASE_PAGINATION = {
  page: 1,
  per_page: 5,
  total_items: 1260,
} as const;

export const JOURNAL_NEW_ENTRY_DEFAULT_METADATA: ManualJournalMetadata = {
  reference_number: "JE-2023-0089",
  journal_reference: "",
  journal_date: "",
};

export const JOURNAL_NEW_ENTRY_ACCOUNT_OPTIONS: ManualJournalAccountOption[] = [
  { value: "6001", label: "6001 - Office Expenses" },
  { value: "1001", label: "1001 - Cash on Hand" },
  { value: "2001", label: "2001 - Accounts Payable" },
  { value: "1002", label: "1002 - Bank BCA" },
];

export const JOURNAL_NEW_ENTRY_DEFAULT_LINES: ManualJournalLineItem[] = [
  {
    line_id: "line-1",
    account_code: "6001",
    label_description: "",
    debit_amount: 1500000,
    credit_amount: 0,
  },
  {
    line_id: "line-2",
    account_code: "1002",
    label_description: "",
    debit_amount: 0,
    credit_amount: 1500000,
  },
];

export const JOURNAL_NEW_ENTRY_INLINE_AUDIT: JournalInlineAuditItem[] = [
  {
    timestamp: "Nov 14, 2023 10:45 AM",
    user_initial: "AS",
    user_name: "Admin Staff",
    action: "Edited",
    details:
      "Changed amount for Line 1 from Rp 1,200,000 to Rp 1,500,000",
  },
  {
    timestamp: "Nov 14, 2023 09:30 AM",
    user_initial: "FM",
    user_name: "Finance Manager",
    action: "Draft Saved",
    details: "Saved draft version. Total: Rp 1,200,000",
  },
  {
    timestamp: "Nov 14, 2023 09:15 AM",
    user_initial: "AS",
    user_name: "Admin Staff",
    action: "Created",
    details: "Initial creation of journal entry JE-2023-0089",
  },
];
