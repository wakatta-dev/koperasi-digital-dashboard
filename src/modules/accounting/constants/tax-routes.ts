/** @format */

export const ACCOUNTING_TAX_ROUTES = {
  summary: "/bumdes/accounting/tax",
  ppnDetails: "/bumdes/accounting/tax/ppn-details",
  pphRecords: "/bumdes/accounting/tax/pph-records",
  exportHistory: "/bumdes/accounting/tax/export-history",
  efakturExport: "/bumdes/accounting/tax/e-faktur-export",
} as const;

export const ACCOUNTING_TAX_FLOW_ORDER = [
  "Summary & Period",
  "PPN Details",
  "PPh Records",
  "Export History",
  "e-Faktur Export",
] as const;
