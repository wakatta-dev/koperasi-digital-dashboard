/** @format */

import type {
  AddBankAccountDraft,
  BankAccountCardItem,
  BankAccountTransactionItem,
  BankAccountTransactionSummary,
  BankCashSummaryCard,
  BankCashTransactionFilters,
  BankStatementLineItem,
  CashRegisterItem,
  ImportStatementDraft,
  ReconciliationSessionView,
  SystemLedgerLineItem,
  UnreconciledTransactionItem,
} from "../types/bank-cash";

export const DUMMY_BANK_CASH_SUMMARY_CARDS: BankCashSummaryCard[] = [
  {
    key: "total-cash-balance",
    label: "Total Cash Balance",
    value: "Rp 1.850.250.000",
    tone: "primary",
  },
  {
    key: "pending-reconciliation",
    label: "Pending Reconciliation",
    value: "17 Items",
    helper_text: "Needs Attention",
    tone: "warning",
  },
  {
    key: "petty-cash-balance",
    label: "Petty Cash Balance",
    value: "Rp 12.500.000",
    tone: "success",
  },
];

export const DUMMY_BANK_ACCOUNTS: BankAccountCardItem[] = [
  {
    account_id: "bca-corporate",
    bank_badge: "BCA",
    bank_badge_class_name: "bg-blue-600",
    bank_name: "Bank Central Asia",
    account_name: "BCA Corporate",
    masked_account_number: "**** 8899",
    available_balance: "Rp 850.000.000",
    last_sync_label: "Last sync: 10 mins ago",
    unreconciled_count: 5,
    status: "Active",
  },
  {
    account_id: "mandiri-business",
    bank_badge: "MDR",
    bank_badge_class_name: "bg-slate-700",
    bank_name: "Bank Mandiri",
    account_name: "Mandiri Business",
    masked_account_number: "**** 1234",
    available_balance: "Rp 450.000.000",
    last_sync_label: "Last sync: 1 hour ago",
    unreconciled_count: 12,
    status: "Active",
  },
  {
    account_id: "bri-payroll",
    bank_badge: "BRI",
    bank_badge_class_name: "bg-emerald-600",
    bank_name: "Bank Rakyat Indonesia",
    account_name: "BRI Payroll",
    masked_account_number: "**** 5678",
    available_balance: "Rp 537.750.000",
    last_sync_label: "Last sync: 2 mins ago",
    unreconciled_count: 0,
    status: "Active",
  },
];

export const DUMMY_UNRECONCILED_TRANSACTIONS: UnreconciledTransactionItem[] = [
  {
    id: "ur-1",
    date: "Nov 14, 2023",
    description: "Monthly Bank Fee",
    source: "Bank Statement",
    amount: "-Rp 25.000",
    direction: "Debit",
    can_match: true,
  },
  {
    id: "ur-2",
    date: "Nov 11, 2023",
    description: "Internet Bill: Telkom Indihome",
    source: "Bank Statement",
    amount: "-Rp 1.450.000",
    direction: "Debit",
    can_match: true,
  },
  {
    id: "ur-3",
    date: "Nov 10, 2023",
    description: "Adjustment Difference",
    source: "System",
    amount: "+Rp 2.500.000",
    direction: "Credit",
    can_match: true,
  },
];

export const DUMMY_CASH_REGISTERS: CashRegisterItem[] = [
  {
    id: "cr-1",
    register_name: "Petty Cash HO",
    register_type: "Operational",
    balance_label: "Rp 7.500.000",
    status_label: "Active",
  },
  {
    id: "cr-2",
    register_name: "Kas Toko Cabang",
    register_type: "Retail",
    balance_label: "Rp 5.000.000",
    status_label: "Active",
  },
];

export const DUMMY_RECONCILIATION_SESSION: ReconciliationSessionView = {
  account_id: "bca-corporate",
  session_reference: "REC-BCA-2023-11",
  account_title: "Bank Central Asia (IDR)",
  account_meta: "Acct: 893-221-009 | Statement Ending: 30 Nov 2023",
  status: "Draft",
  can_confirm: true,
  can_open_detail: false,
  cards: {
    statement_balance_amount: "Rp 145,200,000",
    system_balance_amount: "Rp 142,700,000",
    difference_amount: "Rp 2,500,000",
  },
};

export const DUMMY_BANK_STATEMENT_LINES: BankStatementLineItem[] = [
  {
    line_id: "bs-1",
    date: "Nov 28",
    description: "TRF CR PT MAJU MUNDUR",
    reference_no: "992831",
    amount: "+ 15,000,000",
    direction: "Credit",
    is_selected: true,
    is_matched: true,
  },
  {
    line_id: "bs-2",
    date: "Nov 27",
    description: "DB: BIAYA ADM",
    amount: "- 25,000",
    direction: "Debit",
    is_selected: false,
    is_matched: false,
  },
  {
    line_id: "bs-3",
    date: "Nov 26",
    description: "TRF CR PT TEKNOLOGI NUSANTARA",
    reference_no: "882901",
    amount: "+ 45,500,000",
    direction: "Credit",
    is_selected: false,
    is_matched: false,
  },
];

export const DUMMY_SYSTEM_LEDGER_LINES: SystemLedgerLineItem[] = [
  {
    line_id: "sl-1",
    date: "Nov 28",
    partner_or_ref: "INV-2023-0045",
    document_ref: "PT MAJU MUNDUR",
    amount: "+ 15,000,000",
    direction: "Credit",
    is_selected: true,
    is_matched: true,
  },
  {
    line_id: "sl-2",
    date: "Nov 27",
    partner_or_ref: "Bank Admin Fee",
    document_ref: "General Ledger",
    amount: "- 25,000",
    direction: "Debit",
    is_selected: false,
    is_matched: false,
  },
  {
    line_id: "sl-3",
    date: "Nov 26",
    partner_or_ref: "INV-2023-0098",
    document_ref: "PT Teknologi Nusantara",
    amount: "+ 45,500,000",
    direction: "Credit",
    is_selected: false,
    is_matched: false,
  },
];

export const DUMMY_BANK_ACCOUNT_TRANSACTION_SUMMARY: BankAccountTransactionSummary = {
  current_balance: "Rp 850.000.000",
  current_balance_delta_label: "+2.4% from last month",
  last_synced_at: "Today, 10:45 AM",
};

export const DUMMY_BANK_ACCOUNT_TRANSACTION_FILTERS: BankCashTransactionFilters = {
  date_range: "Last 30 Days",
  transaction_type: "All Types",
  status: "All Status",
  q: "",
};

export const DUMMY_BANK_ACCOUNT_TRANSACTIONS: BankAccountTransactionItem[] = [
  {
    transaction_id: "tx-1",
    date: "Nov 14, 2023",
    description: "Monthly Bank Fee",
    reference_label: "Reference: BCA-99231",
    amount: "-Rp 25.000",
    direction: "Debit",
    status: "Unreconciled",
  },
  {
    transaction_id: "tx-2",
    date: "Nov 13, 2023",
    description: "Customer Payment: INV-2023-0045",
    reference_label: "Payer: PT. Teknologi Nusantara",
    amount: "+Rp 45.500.000",
    direction: "Credit",
    status: "Reconciled",
  },
  {
    transaction_id: "tx-3",
    date: "Nov 12, 2023",
    description: "Salary Payment - Batch Nov",
    reference_label: "Internal Reference: PAY-011",
    amount: "-Rp 120.000.000",
    direction: "Debit",
    status: "Reconciled",
  },
  {
    transaction_id: "tx-4",
    date: "Nov 11, 2023",
    description: "Internet Bill: Telkom Indihome",
    reference_label: "Subscriber: 1223450099",
    amount: "-Rp 1.450.000",
    direction: "Debit",
    status: "Unreconciled",
  },
];

export const DUMMY_ADD_BANK_ACCOUNT_DRAFT: AddBankAccountDraft = {
  bank_name: "",
  account_name: "",
  account_number: "",
  currency_code: "IDR",
  initial_balance_amount: "",
};

export const DUMMY_IMPORT_STATEMENT_DRAFT: ImportStatementDraft = {
  account_id: "",
  file_name: "",
  file_type: "",
  file_size_bytes: 0,
};
