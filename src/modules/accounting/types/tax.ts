/** @format */

export type TaxTabKey =
  | "summary"
  | "ppn-details"
  | "pph-records"
  | "export-history"
  | "e-faktur-export";

export type TaxSummaryTone = "primary" | "warning" | "success" | "danger";

export type TaxSummaryMetricCard = {
  key: string;
  label: string;
  value: string;
  helper_text?: string;
  tone?: TaxSummaryTone;
};

export type TaxSummaryPeriodStatus = "Open" | "Reported" | "Compensated";

export type TaxSummaryPeriodItem = {
  period_label: string;
  period_code: string;
  ppn_keluaran: number;
  ppn_masukan: number;
  net_amount: number;
  net_position: "KB" | "LB";
  total_pph: number;
  status: TaxSummaryPeriodStatus;
};

export type TaxSummaryFilterValue = {
  q: string;
  year: string;
  status: "all" | TaxSummaryPeriodStatus;
};

export type TaxPagination = {
  page: number;
  per_page: number;
  total_items: number;
};

export type TaxPpnFilterValue = {
  q: string;
  period: string;
  transaction_type: "All Types" | "Sales" | "Purchase";
};

export type TaxPpnTransactionItem = {
  period_code: string;
  date: string;
  invoice_number: string;
  counterparty_name: string;
  counterparty_npwp?: string;
  transaction_type: "Sales" | "Purchase";
  tax_base_amount: number;
  vat_amount: number;
};

export type TaxPphFilterValue = {
  q: string;
  period: string;
  type: "All Types" | "PPh21" | "PPh23" | "PPh4_2" | "PPhFinal";
};

export type TaxPphRecordItem = {
  date: string;
  reference_number: string;
  partner_name: string;
  partner_npwp?: string;
  pph_type: "PPh21" | "PPh23" | "PPh4_2" | "PPhFinal";
  gross_amount: number;
  withheld_amount: number;
  category_label: string;
};

export type TaxPphSummaryTone = "neutral" | "purple" | "teal" | "orange";

export type TaxPphSummaryCard = {
  key: string;
  label: string;
  helper_text: string;
  value: string;
  note: string;
  tone: TaxPphSummaryTone;
};

export type TaxExportHistoryFilterValue = {
  q: string;
  type: "all" | "EFaktur" | "PPhReport" | "PPNSummary" | "TaxRecapitulation";
  status: "all" | "Queued" | "Processing" | "Success" | "Failed";
};

export type TaxExportHistoryItem = {
  export_id: string;
  date: string;
  time: string;
  file_name: string;
  export_type: "EFaktur" | "PPhReport" | "PPNSummary" | "TaxRecapitulation";
  status: "Queued" | "Processing" | "Success" | "Failed";
  can_retry: boolean;
  can_download: boolean;
};

export type TaxEfakturFilterValue = {
  date_range: string;
  tax_type: string;
  status: string;
};

export type TaxEfakturReadyItem = {
  invoice_id: string;
  invoice_number: string;
  date: string;
  counterparty: string;
  tax_base_amount: number;
  vat_amount: number;
  is_selected_default: boolean;
};

export type TaxComplianceStepStatus = "Completed" | "Pending" | "Failed";

export type TaxComplianceStep = {
  key: string;
  label: string;
  status: TaxComplianceStepStatus;
};

export type TaxIncomeTaxReportLine = {
  key: string;
  label: string;
  helper_text: string;
  value: number;
  tone: "blue" | "purple" | "orange";
};
