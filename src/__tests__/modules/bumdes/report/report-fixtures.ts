/** @format */

import type {
  BalanceSheetReport,
  CashFlowReport,
  OverviewReport,
  ProfitLossReport,
  SalesDetailReport,
} from "@/modules/bumdes/report/types";

export const overviewReportWithDuplicates: OverviewReport = {
  period_label: "Januari 2026",
  updated_at: "10/01/2026",
  kpis: [
    {
      title: "Total Pendapatan",
      value_display: "Rp 12.000.000",
      delta_display: "+5%",
      is_positive: true,
    },
    {
      title: "Total Pendapatan",
      value_display: "Rp 12.000.000",
      delta_display: "+5%",
      is_positive: true,
    },
    {
      title: "Total Pengeluaran",
      value_display: "Rp 6.500.000",
      delta_display: "-2%",
      is_positive: false,
    },
  ],
  monthly_performance: [
    { label: "Jan", revenue_pct: 60, expense_pct: 35 },
    { label: "Jan", revenue_pct: 55, expense_pct: 40 },
    { label: "Feb", revenue_pct: 65, expense_pct: 38 },
  ],
  revenue_segments: [
    { label_display: "Penjualan POS", pct: 45 },
    { label_display: "Penjualan POS", pct: 25 },
    { label_display: "Penjualan Online", pct: 30 },
  ],
  recent_transactions: [
    {
      date_display: "10/01/2026",
      description: "Penjualan POS",
      category: "POS",
      amount_display: "Rp 1.200.000",
      badge_class: "bg-emerald-100 text-emerald-700",
    },
    {
      date_display: "10/01/2026",
      description: "Penjualan POS",
      category: "POS",
      amount_display: "Rp 1.200.000",
      badge_class: "bg-emerald-100 text-emerald-700",
    },
  ],
};

export const cashFlowReportWithDuplicates: CashFlowReport = {
  period_label: "Januari 2026",
  updated_at: "10/01/2026",
  rows: [
    { type: "section", label: "Aktivitas Operasi" },
    { type: "item", label: "Penjualan POS", value_display: "Rp 1.200.000" },
    { type: "item", label: "Penjualan POS", value_display: "Rp 1.200.000" },
    { type: "total", label: "Total Operasi", value_display: "Rp 2.400.000" },
  ],
  notes: ["Catatan sama", "Catatan sama"],
};

export const profitLossReportWithDuplicates: ProfitLossReport = {
  period_label: "Januari 2026",
  updated_at: "10/01/2026",
  summary_cards: [
    {
      title: "Total Pendapatan",
      value_display: "Rp 12.000.000",
      delta_display: "+5%",
    },
    {
      title: "Total Pendapatan",
      value_display: "Rp 12.000.000",
      delta_display: "+5%",
    },
  ],
  rows: [
    { type: "section", label: "Pendapatan" },
    { type: "row", label: "Penjualan POS", value_display: "Rp 1.200.000" },
    { type: "row", label: "Penjualan POS", value_display: "Rp 1.200.000" },
    { type: "total", label: "Total Pendapatan", value_display: "Rp 2.400.000" },
  ],
  notes: ["Catatan sama", "Catatan sama"],
};

export const balanceSheetReportWithDuplicates: BalanceSheetReport = {
  period_label: "Januari 2026",
  updated_at: "10/01/2026",
  assets: [
    { label: "Kas", value_display: "Rp 2.000.000" },
    { label: "Kas", value_display: "Rp 2.000.000" },
  ],
  liabilities: [
    { label: "Hutang Usaha", value_display: "Rp 1.500.000" },
    { label: "Hutang Usaha", value_display: "Rp 1.500.000" },
  ],
  equity: [
    { label: "Modal", value_display: "Rp 500.000" },
    { label: "Modal", value_display: "Rp 500.000" },
  ],
  asset_total_display: "Rp 4.000.000",
  liab_equity_total_display: "Rp 4.000.000",
  asset_info: [
    { label: "Detail Kas", value_display: "Rp 2.000.000" },
    { label: "Detail Kas", value_display: "Rp 2.000.000" },
  ],
  liability_info: [
    { label: "Detail Hutang", value_display: "Rp 1.500.000" },
    { label: "Detail Hutang", value_display: "Rp 1.500.000" },
  ],
  status_label: "Seimbang",
  notes: ["Catatan neraca"],
};

export const salesDetailReportWithDuplicates: SalesDetailReport = {
  period_label: "Januari 2026",
  updated_at: "10/01/2026",
  summary_cards: [
    {
      title: "Total Transaksi",
      value_display: "120",
      delta_display: "+3%",
    },
    {
      title: "Total Transaksi",
      value_display: "120",
      delta_display: "+3%",
    },
  ],
  top_products: [
    {
      name: "Produk A",
      units_display: "50",
      revenue_display: "Rp 5.000.000",
      pct: 40,
    },
    {
      name: "Produk A",
      units_display: "50",
      revenue_display: "Rp 5.000.000",
      pct: 40,
    },
  ],
  channel_breakdown: [
    {
      label: "POS",
      revenue_display: "Rp 8.000.000",
      pct_display: "60%",
      color_key: "bg-emerald-500",
      transactions: 80,
      average_ticket_display: "Rp 100.000",
    },
    {
      label: "POS",
      revenue_display: "Rp 8.000.000",
      pct_display: "60%",
      color_key: "bg-emerald-500",
      transactions: 80,
      average_ticket_display: "Rp 100.000",
    },
  ],
  channel_comparison: [
    {
      label: "POS",
      transaction_count: 80,
      average_ticket_display: "Rp 100.000",
    },
    {
      label: "POS",
      transaction_count: 80,
      average_ticket_display: "Rp 100.000",
    },
  ],
};
