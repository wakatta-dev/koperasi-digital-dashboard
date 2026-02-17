/** @format */

import type {
  JournalAuditLogFilterValue,
  JournalAuditLogRow,
  JournalAuditSummaryCounter,
  JournalDetailGeneralInformation,
  JournalDetailHeader,
  JournalDetailIntegrity,
  JournalDetailItem,
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

export const JOURNAL_DETAIL_HEADER: JournalDetailHeader = {
  journal_number: "JE/2023/0142",
  status: "Posted",
  posted_label: "Posted on Nov 14, 2023 by System Admin",
};

export const JOURNAL_DETAIL_GENERAL_INFORMATION: JournalDetailGeneralInformation = {
  reference_number: "JE/2023/0142",
  journal_date: "November 14, 2023",
  partner_entity: "PT. Supplier Jaya",
  journal_name: "Vendor Payment - Invoice #INV-2023-0092",
};

export const JOURNAL_DETAIL_ITEMS: JournalDetailItem[] = [
  {
    account_name: "211000 Accounts Payable",
    account_category: "Liabilities",
    label: "Payment for Vendor Bill #INV/2023/0092",
    debit_amount: "15,000,000.00",
    credit_amount: "0.00",
  },
  {
    account_name: "111100 Bank Account (IDR)",
    account_category: "Current Assets",
    label: "Payment for Vendor Bill #INV/2023/0092",
    debit_amount: "0.00",
    credit_amount: "15,000,000.00",
  },
];

export const JOURNAL_DETAIL_TOTALS = {
  debit_amount: "15,000,000.00",
  credit_amount: "15,000,000.00",
} as const;

export const JOURNAL_DETAIL_INTEGRITY: JournalDetailIntegrity = {
  balanced_label: "Balanced Entry",
  immutable_label: "Immutable Record",
  last_modified_label: "Last modified: Nov 14, 2023 14:22:10 (ID: SYS_9921)",
};

export const JOURNAL_AUDIT_LOG_DEFAULT_FILTERS: JournalAuditLogFilterValue = {
  q: "",
  user: "all",
  module: "all",
  date_from: "",
  date_to: "",
  journal_number: "",
};

export const JOURNAL_AUDIT_LOG_ROWS: JournalAuditLogRow[] = [
  {
    timestamp_date: "Nov 14, 2023",
    timestamp_time: "14:25:32 WIB",
    user_initial: "S",
    user_name: "Shadcn",
    module: "Journal",
    action: "Posted",
    reference_no: "JE/2023/0142",
    change_details: "Posted journal entry for Vendor Payment (PT. Supplier Jaya)",
  },
  {
    timestamp_date: "Nov 14, 2023",
    timestamp_time: "14:10:15 WIB",
    user_initial: "S",
    user_name: "Shadcn",
    module: "Journal",
    action: "Edited",
    reference_no: "JE/2023/0142",
    change_details: "Updated Total Credit from 14,000,000 to 15,000,000",
  },
  {
    timestamp_date: "Nov 14, 2023",
    timestamp_time: "11:45:00 WIB",
    user_initial: "Sys",
    user_name: "System",
    module: "Invoice",
    action: "Created",
    reference_no: "INV/2023/1024",
    change_details: "Automated invoice generation for Recurring Order #RO-992",
  },
  {
    timestamp_date: "Nov 13, 2023",
    timestamp_time: "16:55:12 WIB",
    user_initial: "JD",
    user_name: "John Doe",
    module: "Journal",
    action: "Deleted",
    reference_no: "JE/2023/0139",
    change_details: "Deleted draft entry (duplicate entry found)",
  },
  {
    timestamp_date: "Nov 12, 2023",
    timestamp_time: "09:00:01 WIB",
    user_initial: "S",
    user_name: "Shadcn",
    module: "Setting",
    action: "Locked",
    reference_no: "Oct-2023",
    change_details: "Locked period October 2023 for all modules",
  },
];

export const JOURNAL_AUDIT_LOG_SUMMARY_COUNTERS: JournalAuditSummaryCounter[] = [
  {
    key: "created",
    label: "Created",
    value: "1,420",
    tone: "emerald",
  },
  {
    key: "edited",
    label: "Edited",
    value: "842",
    tone: "amber",
  },
  {
    key: "deleted",
    label: "Deleted",
    value: "56",
    tone: "red",
  },
  {
    key: "posted",
    label: "Posted",
    value: "522",
    tone: "blue",
  },
];
