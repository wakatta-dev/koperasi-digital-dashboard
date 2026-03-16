/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCards } from "@/components/shared/data-display/KpiCards";
import { analyticsFixture } from "./fixtures/analytics";
import { toAnalyticsKpiItems } from "@/modules/dashboard/analytics/lib/kpi-items";

describe("analytics KPI item mapping", () => {
  it("renders loading state", () => {
    render(<KpiCards items={[]} isLoading />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("maps analytics kpis to generic items with values and trends", () => {
    const items = toAnalyticsKpiItems(analyticsFixture.kpis);

    render(<KpiCards items={items} />);
    expect(screen.getByText("Penjualan Hari Ini")).toBeTruthy();
    expect(screen.getByText(/Rp/)).toBeTruthy();
    expect(screen.getByText(/20.1%/)).toBeTruthy();
  });

  it("renders empty state when no kpis", () => {
    render(<KpiCards items={[]} />);
    expect(screen.getByRole("alert")).toBeTruthy();
  });
});
