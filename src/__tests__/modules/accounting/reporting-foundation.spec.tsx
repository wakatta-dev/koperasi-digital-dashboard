/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";
import {
  ACCOUNTING_REPORTING_FLOW_ORDER,
  ReportingAccountLedgerPage,
  ReportingBalanceSheetPage,
  ReportingCashFlowPage,
  ReportingCatalogPage,
  ReportingGeneralLedgerPage,
  ReportingProfitLossComparativePage,
  ReportingProfitLossPage,
  ReportingTrialBalancePage,
} from "@/modules/accounting";

let pathnameMock = "/bumdes/accounting/reporting";
let searchParamsMock = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => pathnameMock,
  useSearchParams: () => searchParamsMock,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingReportingProfitLoss: () => ({
    data: { period_label: "Period", summary_cards: [], rows: [], notes: [] },
    error: null,
    isPending: false,
  }),
  useAccountingReportingCashFlow: () => ({
    data: { period_label: "Period", rows: [], notes: [] },
    error: null,
    isPending: false,
  }),
  useAccountingReportingBalanceSheet: () => ({
    data: {
      period_label: "Period",
      assets: [],
      liabilities: [],
      equity: [],
      asset_total_display: "$ 0.00",
      liab_equity_total_display: "$ 0.00",
      asset_info: [],
      liability_info: [],
      status_label: "Neraca Seimbang",
      notes: [],
    },
    error: null,
    isPending: false,
  }),
  useAccountingReportingProfitLossComparative: () => ({
    data: { period_label: "Period", compare_label: "Compare", rows: [], meta: { generated_at: "-", currency: "USD" } },
    error: null,
    isPending: false,
  }),
  useAccountingReportingTrialBalance: () => ({
    data: { period_label: "Period", rows: [], totals: { initial_balance: 0, debit: 0, credit: 0, ending_balance: 0 } },
    error: null,
    isPending: false,
  }),
  useAccountingReportingGeneralLedger: () => ({
    data: { period_label: "Period", groups: [], pagination: { page: 1, page_size: 20, total_accounts: 0 } },
    error: null,
    isPending: false,
  }),
  useAccountingReportingAccountLedger: () => ({
    data: {
      account: { id: "101000", code: "101000", name: "Bank Central Asia" },
      summary: { total_debit: 0, total_credit: 0, current_balance: 0 },
      entries: [],
      totals: { debit: 0, credit: 0 },
      pagination: { page: 1, page_size: 20, total_entries: 0 },
    },
    error: null,
    isPending: false,
  }),
}));

describe("reporting foundation", () => {
  beforeEach(() => {
    pathnameMock = "/bumdes/accounting/reporting";
    searchParamsMock = new URLSearchParams();
  });

  it("renders all accounting reporting page containers", () => {
    render(<ReportingCatalogPage />);
    expect(screen.getByRole("heading", { name: "Laporan Keuangan" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/profit-loss";
    render(<ReportingProfitLossPage />);
    expect(screen.getByRole("heading", { name: "Profit and Loss" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/cash-flow";
    render(<ReportingCashFlowPage />);
    expect(screen.getByRole("heading", { name: "Cash Flow Statement" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/balance-sheet";
    render(<ReportingBalanceSheetPage />);
    expect(screen.getByRole("heading", { name: "Balance Sheet" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/p-and-l-comparative";
    render(<ReportingProfitLossComparativePage />);
    expect(screen.getByRole("heading", { name: "P&L Comparative" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/trial-balance";
    render(<ReportingTrialBalancePage />);
    expect(screen.getByRole("heading", { name: "Detail Trial Balance Report" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/general-ledger";
    render(<ReportingGeneralLedgerPage />);
    expect(screen.getByRole("heading", { name: "General Ledger" })).toBeTruthy();

    pathnameMock = "/bumdes/accounting/reporting/account-ledger";
    render(<ReportingAccountLedgerPage accountId="101000" />);
    expect(screen.getByRole("heading", { name: "Account Ledger" })).toBeTruthy();
  });

  it("registers reporting submenu entries under accounting", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();

    const reportingItem = accountingItem?.items?.find((item) => item.name === "Reporting");
    expect(reportingItem).toBeTruthy();
    expect(reportingItem?.items).toEqual([
      { name: "Profit and Loss", href: "/bumdes/accounting/reporting/profit-loss" },
      { name: "Cash Flow Statement", href: "/bumdes/accounting/reporting/cash-flow" },
      { name: "Balance Sheet", href: "/bumdes/accounting/reporting/balance-sheet" },
      {
        name: "P&L Comparative",
        href: "/bumdes/accounting/reporting/p-and-l-comparative",
      },
      { name: "Trial Balance", href: "/bumdes/accounting/reporting/trial-balance" },
      { name: "General Ledger", href: "/bumdes/accounting/reporting/general-ledger" },
      { name: "Account Ledger", href: "/bumdes/accounting/reporting/account-ledger" },
    ]);
  });

  it("registers title map entries for reporting child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/reporting"]).toBe("Accounting - Reporting");
    expect(bumdesTitleMap["/bumdes/accounting/reporting/profit-loss"]).toBe(
      "Accounting - Reporting - Profit and Loss",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/cash-flow"]).toBe(
      "Accounting - Reporting - Cash Flow Statement",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/balance-sheet"]).toBe(
      "Accounting - Reporting - Balance Sheet",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/p-and-l-comparative"]).toBe(
      "Accounting - Reporting - P&L Comparative",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/trial-balance"]).toBe(
      "Accounting - Reporting - Trial Balance",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/general-ledger"]).toBe(
      "Accounting - Reporting - General Ledger",
    );
    expect(bumdesTitleMap["/bumdes/accounting/reporting/account-ledger"]).toBe(
      "Accounting - Reporting - Account Ledger",
    );
  });

  it("documents reporting flow order", () => {
    expect(ACCOUNTING_REPORTING_FLOW_ORDER).toEqual([
      "Reporting Catalog",
      "Profit and Loss",
      "Cash Flow Statement",
      "Balance Sheet",
      "P&L Comparative",
      "Trial Balance",
      "General Ledger",
      "Account Ledger",
    ]);
  });
});
