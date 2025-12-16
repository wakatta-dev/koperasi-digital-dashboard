/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCards } from "@/modules/finance/components/KpiCards";
import { sampleSummary } from "@/__tests__/__fixtures__/finance-report/sampleResponses";

describe("KpiCards", () => {
  it("renders KPI values and trend", () => {
    render(<KpiCards kpis={sampleSummary.kpis} />);

    expect(screen.getByText("Omzet Total")).toBeTruthy();
    expect(
      screen.getByText((text) => text.includes("456.789.000"))
    ).toBeTruthy();
    expect(screen.getByText(/Jumlah Transaksi/)).toBeTruthy();
    expect(screen.getByText("1.234")).toBeTruthy();
    expect(screen.getAllByText(/\+12,5%/i).length).toBeGreaterThan(0);
  });

  it("shows empty state when missing data", () => {
    render(<KpiCards kpis={undefined} />);

    expect(screen.getByText(/Belum ada data/)).toBeTruthy();
  });
});
