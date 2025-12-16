/** @format */

export const sampleDateRange = {
  start: "2023-01-01",
  end: "2023-01-31",
  preset: "month",
} as const;

export const sampleSummary = {
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

export const sampleTopProducts = {
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
  ],
  meta: { last_updated: "2023-01-31T15:30:00Z" },
};

export const sampleChannels = {
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
