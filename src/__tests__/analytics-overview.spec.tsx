/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OverviewChart } from "@/modules/dashboard/analytics/components/overview-chart";
import { analyticsFixture } from "./fixtures/analytics";

vi.mock("recharts", () => {
  const Fake = ({ children, ...props }: any) => (
    <div data-testid="chart-mock" {...props}>
      {children}
    </div>
  );
  return {
    ResponsiveContainer: Fake,
    BarChart: Fake,
    CartesianGrid: Fake,
    XAxis: Fake,
    YAxis: Fake,
    Tooltip: Fake,
    Legend: Fake,
    Bar: Fake,
    Line: Fake,
  };
});

describe("OverviewChart", () => {
  it("shows empty state when no data", () => {
    render(<OverviewChart series={[]} />);
    expect(screen.getByText(/Belum ada data/i)).toBeTruthy();
  });

  it("renders chart when data provided", () => {
    render(<OverviewChart series={analyticsFixture.overview.series} />);
    expect(screen.getAllByTestId("chart-mock").length).toBeGreaterThan(0);
  });
});
