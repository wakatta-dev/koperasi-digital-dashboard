/** @format */

import type {
  BalanceSheetResponse,
  CashFlowResponse,
  ChannelsResponse,
  FinancePreset,
  OverviewResponse,
  ProfitLossResponse,
  SalesSummaryResponse,
  TopProductsResponse,
} from "./types";

export const sampleDateRange: SalesSummaryResponse["range"] = {
  start: "2023-01-01",
  end: "2023-01-31",
  preset: "month" as FinancePreset,
  display_label: "01/01/2023 - 31/01/2023",
};

export const sampleSummaryResponse: SalesSummaryResponse = {
  range: sampleDateRange,
  kpis: {
    total_revenue: 456_789_000,
    transaction_count: 1234,
    average_ticket: 370_170,
    delta_label: "+12,5% dari bulan lalu",
    delta_direction: "up",
    comparison_period: "2022-12-01 to 2022-12-31",
    last_updated: "2023-01-31T15:30:00Z",
  },
};

export const sampleTopProductsResponse: TopProductsResponse = {
  items: [
    {
      product_id: "prod-a",
      name: "Produk A",
      units_sold: 532,
      revenue: 159_600_000,
      contribution_pct: 35,
    },
    {
      product_id: "prod-b",
      name: "Produk B",
      units_sold: 421,
      revenue: 126_300_000,
      contribution_pct: 28,
    },
    {
      product_id: "prod-c",
      name: "Produk C",
      units_sold: 289,
      revenue: 86_700_000,
      contribution_pct: 19,
    },
    {
      product_id: "prod-d",
      name: "Produk D",
      units_sold: 186,
      revenue: 55_800_000,
      contribution_pct: 12,
    },
    {
      product_id: "prod-e",
      name: "Produk E",
      units_sold: 92,
      revenue: 27_600_000,
      contribution_pct: 6,
    },
  ],
  meta: { last_updated: "2023-01-31T15:30:00Z" },
};

export const sampleChannelsResponse: ChannelsResponse = {
  items: [
    {
      channel_id: "pos",
      name: "Kasir (POS)",
      revenue: 319_752_300,
      share_pct: 70,
      transactions: 876,
      average_ticket: 365_014,
    },
    {
      channel_id: "marketplace",
      name: "Marketplace",
      revenue: 137_036_700,
      share_pct: 30,
      transactions: 358,
      average_ticket: 382_784,
    },
  ],
  meta: { last_updated: "2023-01-31T15:30:00Z" },
};

export const sampleOverviewResponse: OverviewResponse = {
  range: sampleDateRange,
  kpis: [
    {
      title: "Total Pendapatan",
      value: "Rp 456.789.000",
      delta: "+12,5% dari bulan lalu",
      positive: true,
    },
    {
      title: "Laba Kotor",
      value: "Rp 218.450.000",
      delta: "+8,3% dari bulan lalu",
      positive: true,
    },
    {
      title: "Margin Kotor",
      value: "47,8%",
      delta: "+3,2% dari bulan lalu",
      positive: true,
    },
    {
      title: "Total Biaya",
      value: "Rp 98.500.000",
      delta: "-2,1% dari bulan lalu",
      positive: false,
    },
  ],
  revenue_breakdown: sampleTopProductsResponse.items.map((p) => ({
    label: p.name,
    value: p.revenue,
    pct: p.contribution_pct,
  })),
  channel_breakdown: sampleChannelsResponse.items.map((c) => ({
    id: c.channel_id,
    name: c.name,
    value: c.revenue,
    pct: c.share_pct,
    transactions: c.transactions,
    average_ticket: c.average_ticket,
  })),
};

export const sampleProfitLossResponse: ProfitLossResponse = {
  range: sampleDateRange,
  summary: sampleOverviewResponse.kpis,
  rows: [
    { label: "Pendapatan", value: 456_789_000, highlight: true },
    { label: "Beban Pokok Penjualan (HPP)", value: -238_339_000 },
    { label: "Laba Kotor", value: 218_450_000, highlight: true },
    { label: "Beban Operasional", value: -82_300_000 },
    { label: "Beban Pemasaran", value: -9_750_000, level: 1 },
    { label: "Beban Administrasi", value: -12_500_000, level: 1 },
    { label: "Gaji & Tunjangan", value: -45_000_000, level: 1 },
    { label: "Lain-lain", value: -15_050_000, level: 1 },
    { label: "Laba Operasional", value: 136_150_000, highlight: true },
    { label: "Pendapatan/Beban Lain", value: -17_700_000 },
    { label: "Laba Bersih", value: 118_450_000, highlight: true },
  ],
};

export const sampleCashFlowResponse: CashFlowResponse = {
  range: sampleDateRange,
  sections: [
    {
      title: "Arus Kas dari Aktivitas Operasi",
      items: [
        { label: "Penerimaan Kas", value: 3_370_000_000 },
        { label: "Pembayaran Kas", value: -2_950_000_000 },
      ],
    },
    {
      title: "Arus Kas dari Aktivitas Pendanaan",
      items: [{ label: "Pendanaan Bersih", value: 0 }],
    },
  ],
  rows: [
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Penerimaan Kas", description: "Penerimaan dari Pelanggan", amount: 3_250_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Penerimaan Kas", description: "Penerimaan dari Bunga", amount: 75_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Penerimaan Kas", description: "Penerimaan dari Refund Pajak", amount: 45_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Penerimaan Kas", description: "Total Penerimaan Kas", amount: 3_370_000_000, highlight: true },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Pembayaran Kas", description: "Pembayaran kepada Pemasok", amount: -1_850_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Pembayaran Kas", description: "Pembayaran untuk Beban Operasional", amount: -650_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Pembayaran Kas", description: "Pembayaran Pajak", amount: -325_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Pembayaran Kas", description: "Pembayaran Bunga", amount: -125_000_000 },
    { category: "Arus Kas dari Aktivitas Operasi", subcategory: "Pembayaran Kas", description: "Total Pembayaran Kas", amount: -2_950_000_000, highlight: true },
    { category: "Arus Kas dari Aktivitas Operasi", description: "Arus Kas Bersih Aktivitas Operasi", amount: 420_000_000, highlight: true },
    { category: "Arus Kas dari Aktivitas Pendanaan", description: "Pembayaran Dividen", amount: -200_000_000 },
    { category: "Arus Kas dari Aktivitas Pendanaan", description: "Penerimaan dari Penerbitan Saham", amount: 500_000_000 },
    { category: "Arus Kas dari Aktivitas Pendanaan", description: "Pembayaran Pinjaman Bank", amount: -300_000_000 },
    { category: "Arus Kas dari Aktivitas Pendanaan", description: "Arus Kas Bersih Aktivitas Pendanaan", amount: 0, highlight: true },
    { category: "Ringkasan Perubahan Kas", description: "Kenaikan / (Penurunan) Kas Bersih", amount: 420_000_000 },
    { category: "Ringkasan Perubahan Kas", description: "Saldo Kas Awal Periode", amount: 1_250_000_000 },
    { category: "Ringkasan Perubahan Kas", description: "Saldo Kas Akhir Periode", amount: 1_670_000_000, highlight: true },
  ],
};

export const sampleBalanceSheetResponse: BalanceSheetResponse = {
  range: sampleDateRange,
  assets: [
    { label: "Kas & Setara Kas", value: 182_450_000 },
    { label: "Piutang Usaha", value: 75_300_000 },
    { label: "Persediaan", value: 64_500_000 },
    { label: "Aset Tetap", value: 210_000_000 },
  ],
  liabilities: [
    { label: "Utang Usaha", value: 58_750_000 },
    { label: "Utang Jangka Pendek", value: 45_000_000 },
    { label: "Utang Jangka Panjang", value: 120_000_000 },
  ],
  equity: [
    { label: "Modal Disetor", value: 180_000_000 },
    { label: "Laba Ditahan", value: 128_500_000 },
  ],
};
