/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ReportingBalanceSheetPage,
  ReportingCashFlowPage,
  ReportingCatalogPage,
  ReportingProfitLossPage,
} from "@/modules/accounting";

const { pushMock, replaceMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
}));

let pathnameMock = "/bumdes/accounting/reporting";
let searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => pathnameMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingReportingProfitLoss: () => ({
    data: {
      period_label: "Oct 1, 2023 - Oct 31, 2023",
      updated_at: "2026-02-18T00:00:00Z",
      summary_cards: [{ title: "Laba Bersih", value_display: "$ 42,850.00" }],
      rows: [
        { type: "section", label: "Operating Income" },
        { type: "row", label: "Sales Revenue", code_display: "400-100", value_display: "$ 125,000.00" },
        { type: "net", label: "Net Profit", value_display: "$ 42,850.00" },
      ],
      notes: [],
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingCashFlow: () => ({
    data: {
      period_label: "Jan 1, 2023 - Dec 31, 2023",
      updated_at: "2026-02-18T00:00:00Z",
      rows: [
        { type: "section", label: "Cash flows from Operating Activities" },
        { type: "item", label: "Net Income", indent: 1, value_display: "45,250.00" },
        { type: "finalPrimary", label: "Closing Cash Balance", value_display: "37,500.00" },
      ],
      notes: [],
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingBalanceSheet: () => ({
    data: {
      period_label: "Oct 31, 2023",
      updated_at: "2026-02-18T00:00:00Z",
      assets: [{ label: "Cash and Cash Equivalents", value_display: "$ 120,500.00" }],
      liabilities: [{ label: "Accounts Payable", value_display: "$ 95,000.00" }],
      equity: [{ label: "Retained Earnings", value_display: "$ 625,500.00" }],
      asset_total_display: "$ 1,245,500.00",
      liab_equity_total_display: "$ 1,245,500.00",
      asset_info: [],
      liability_info: [],
      status_label: "Neraca Seimbang",
      notes: [],
    },
    error: null,
    isPending: false,
  }),
}));

describe("reporting statement core", () => {
  beforeEach(() => {
    pushMock.mockReset();
    replaceMock.mockReset();
    pathnameMock = "/bumdes/accounting/reporting";
    searchParamsMock = new URLSearchParams();
  });

  it("renders catalog sections and routes to selected report", () => {
    render(<ReportingCatalogPage />);

    expect(screen.getByRole("heading", { name: "Statement Reports" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Ledgers" })).toBeTruthy();
    expect(screen.getByText("Balance Sheet")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "View" })[0]);

    expect(pushMock).toHaveBeenCalledWith("/bumdes/accounting/reporting/balance-sheet");
  });

  it("renders profit-loss/cash-flow/balance-sheet core blocks", () => {
    pathnameMock = "/bumdes/accounting/reporting/profit-loss";
    render(<ReportingProfitLossPage />);
    expect(screen.getByRole("heading", { name: "Profit and Loss" })).toBeTruthy();
    expect(screen.getByText("Account Name")).toBeTruthy();
    expect(screen.getByText("Sales Revenue")).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/cash-flow";
    render(<ReportingCashFlowPage />);
    expect(screen.getByRole("heading", { name: "Cash Flow Statement" })).toBeTruthy();
    expect(screen.getByText("Statement of Cash Flows")).toBeTruthy();
    expect(screen.getByText("Closing Cash Balance")).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/balance-sheet";
    render(<ReportingBalanceSheetPage />);
    expect(screen.getByRole("heading", { name: "Balance Sheet" })).toBeTruthy();
    expect(screen.getByText("Total Liabilities & Equity")).toBeTruthy();
  });
});
