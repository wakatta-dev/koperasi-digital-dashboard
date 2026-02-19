/** @format */

export type AccountingTaxPagination = {
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
};

export type AccountingTaxCardTone = "primary" | "warning" | "success" | "danger";

export type AccountingTaxOverviewCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
  tone?: AccountingTaxCardTone;
};

export type AccountingTaxOverviewResponse = {
  cards: AccountingTaxOverviewCard[];
  active_period: {
    year: number;
    month: number;
    label: string;
  };
};

export type AccountingTaxPeriodStatus = "Open" | "Reported" | "Compensated";

export type AccountingTaxPeriodsQuery = {
  q?: string;
  year?: string;
  status?: AccountingTaxPeriodStatus;
  sort?: string;
  page?: number;
  per_page?: number;
};

export type AccountingTaxPeriodItem = {
  period_label: string;
  period_code: string;
  ppn_keluaran: number;
  ppn_masukan: number;
  net_amount: number;
  net_position: "KB" | "LB";
  total_pph: number;
  status: AccountingTaxPeriodStatus;
};

export type AccountingTaxPeriodsResponse = {
  items: AccountingTaxPeriodItem[];
  pagination: AccountingTaxPagination;
};

export type AccountingTaxVatTransactionType = "Sales" | "Purchase";

export type AccountingTaxVatTransactionsQuery = {
  period?: string;
  transaction_type?: AccountingTaxVatTransactionType;
  q?: string;
  page?: number;
  per_page?: number;
};

export type AccountingTaxVatTransactionItem = {
  date: string;
  invoice_number: string;
  counterparty_name: string;
  counterparty_npwp?: string;
  transaction_type: AccountingTaxVatTransactionType;
  tax_base_amount: number;
  vat_amount: number;
};

export type AccountingTaxVatTransactionsResponse = {
  items: AccountingTaxVatTransactionItem[];
  totals: {
    vat_amount_total: number;
  };
  pagination: AccountingTaxPagination;
};

export type AccountingTaxPphType = "PPh21" | "PPh23" | "PPh4_2" | "PPhFinal";

export type AccountingTaxPphRecordsQuery = {
  period?: string;
  type?: AccountingTaxPphType;
  q?: string;
  page?: number;
  per_page?: number;
};

export type AccountingTaxPphSummaryCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
};

export type AccountingTaxPphRecordItem = {
  date: string;
  reference_number: string;
  partner_name: string;
  partner_npwp?: string;
  pph_type: AccountingTaxPphType;
  gross_amount: number;
  withheld_amount: number;
  category_label: string;
};

export type AccountingTaxPphRecordsResponse = {
  summary_cards: AccountingTaxPphSummaryCard[];
  items: AccountingTaxPphRecordItem[];
  pagination: AccountingTaxPagination;
};

export type AccountingTaxExportType =
  | "EFaktur"
  | "PPhReport"
  | "PPNSummary"
  | "TaxRecapitulation";

export type AccountingTaxExportStatus =
  | "Queued"
  | "Processing"
  | "Success"
  | "Failed";

export type AccountingTaxExportHistoryQuery = {
  q?: string;
  type?: AccountingTaxExportType;
  status?: AccountingTaxExportStatus;
  page?: number;
  per_page?: number;
};

export type AccountingTaxExportHistoryItem = {
  export_id: string;
  date: string;
  time: string;
  file_name: string;
  export_type: AccountingTaxExportType;
  status: AccountingTaxExportStatus;
  can_retry: boolean;
  can_download: boolean;
};

export type AccountingTaxExportHistoryResponse = {
  items: AccountingTaxExportHistoryItem[];
  pagination: AccountingTaxPagination;
};

export type AccountingTaxRetryExportResponse = {
  export_id: string;
  status: "Queued" | "Processing";
  job_reference: string;
};

export type AccountingTaxGenerateReportRequest = {
  period: string;
  report_types: string[];
};

export type AccountingTaxGenerateReportResponse = {
  job_reference: string;
  status: "Queued" | "Processing";
};

export type AccountingTaxExportPphReportRequest = {
  period: string;
  types: AccountingTaxPphType[];
};

export type AccountingTaxExportPphReportResponse = {
  job_reference: string;
  status: "Queued" | "Processing";
};

export type AccountingTaxExportPpnRecapRequest = {
  period: string;
  transaction_type?: AccountingTaxVatTransactionType;
};

export type AccountingTaxExportPpnRecapResponse = {
  job_reference: string;
  status: "Queued" | "Processing";
};

export type AccountingTaxEfakturReadyQuery = {
  date_range?: string;
  tax_type?: string;
  status?: string;
  page?: number;
  per_page?: number;
};

export type AccountingTaxEfakturReadyItem = {
  invoice_id: string;
  invoice_number: string;
  date: string;
  counterparty: string;
  tax_base_amount: number;
  vat_amount: number;
  is_selected_default: boolean;
};

export type AccountingTaxEfakturReadyResponse = {
  items: AccountingTaxEfakturReadyItem[];
  pagination: AccountingTaxPagination;
};

export type AccountingTaxEfakturExportRequest = {
  invoice_ids: string[];
};

export type AccountingTaxEfakturExportResponse = {
  batch_reference: string;
  status: "Queued" | "Processing";
  invoice_count: number;
};

export type AccountingTaxIncomeTaxReportQuery = {
  period?: string;
};

export type AccountingTaxIncomeTaxReportResponse = {
  pph21_amount: number;
  pph23_amount: number;
  pph4_2_amount: number;
  total_tax_payable: number;
};

export type AccountingTaxComplianceQuery = {
  period?: string;
};

export type AccountingTaxComplianceStep = {
  key: string;
  label: string;
  status: "Completed" | "Pending" | "Failed";
};

export type AccountingTaxComplianceResponse = {
  as_of: string;
  deadline: string;
  steps: AccountingTaxComplianceStep[];
};

export type AccountingTaxDownloadFileResponse = {
  file_id: string;
  download_url: string;
  expires_at: string;
};
