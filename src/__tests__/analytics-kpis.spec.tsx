/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { KpiCards } from "@/modules/dashboard/analytics/components/kpi-cards";
import { analyticsFixture } from "./fixtures/analytics";

describe("KpiCards", () => {
  it("renders loading state", () => {
    render(<KpiCards isLoading />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("renders KPIs with values and trends", () => {
    render(<KpiCards kpis={analyticsFixture.kpis} />);
    expect(screen.getByText("Penjualan Hari Ini")).toBeTruthy();
    expect(screen.getByText(/Rp/)).toBeTruthy();
    expect(screen.getByText(/20.1%/)).toBeTruthy();
  });

  it("renders empty state when no kpis", () => {
    render(<KpiCards kpis={[]} />);
    expect(screen.getByText(/Belum ada data/i)).toBeTruthy();
  });
});
