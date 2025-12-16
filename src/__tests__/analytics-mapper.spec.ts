/** @format */

import { describe, it, expect } from "vitest";
import { analyticsFixture } from "./fixtures/analytics";
import { mapAnalyticsDataForView } from "@/modules/dashboard/analytics/hooks/use-analytics";

describe("mapAnalyticsDataForView", () => {
  it("uses per-SKU reorder point when present", () => {
    const data = mapAnalyticsDataForView(analyticsFixture);
    const product = data.top_products.find((p) => p.product_id === "sku-1");
    expect(product?.threshold).toBe(8);
    expect(product?.low_stock).toBe(true);
    const lowStockKpi = data.kpis.find((k) => k.id === "low_stock_count");
    expect(lowStockKpi?.value).toBe(1);
  });

  it("falls back to tenant default when SKU reorder point missing", () => {
    const clone = structuredClone(analyticsFixture);
    clone.top_products[0].reorder_point = null as any;
    const data = mapAnalyticsDataForView(clone);
    const product = data.top_products.find((p) => p.product_id === "sku-1");
    expect(product?.threshold).toBe(10);
  });
});
