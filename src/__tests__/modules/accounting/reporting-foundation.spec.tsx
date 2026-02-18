/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

describe("reporting foundation", () => {
  it("renders all accounting reporting page containers", () => {
    const catalog = render(<ReportingCatalogPage />);
    expect(screen.getByRole("heading", { name: "Laporan Keuangan" })).toBeTruthy();
    catalog.unmount();

    const profit = render(<ReportingProfitLossPage />);
    expect(screen.getByRole("heading", { name: "Profit and Loss" })).toBeTruthy();
    profit.unmount();

    const cash = render(<ReportingCashFlowPage />);
    expect(screen.getByRole("heading", { name: "Cash Flow Statement" })).toBeTruthy();
    cash.unmount();

    const balance = render(<ReportingBalanceSheetPage />);
    expect(screen.getByRole("heading", { name: "Balance Sheet" })).toBeTruthy();
    balance.unmount();

    const comparative = render(<ReportingProfitLossComparativePage />);
    expect(screen.getByRole("heading", { name: "P&L Comparative" })).toBeTruthy();
    comparative.unmount();

    const trial = render(<ReportingTrialBalancePage />);
    expect(screen.getByRole("heading", { name: "Detail Trial Balance Report" })).toBeTruthy();
    trial.unmount();

    const general = render(<ReportingGeneralLedgerPage />);
    expect(screen.getByRole("heading", { name: "General Ledger" })).toBeTruthy();
    general.unmount();

    render(<ReportingAccountLedgerPage accountId="10100" />);
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
