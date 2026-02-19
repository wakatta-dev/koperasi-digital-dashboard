/** @format */

import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsIndexPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";
import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";

vi.mock("@/hooks/queries", () => ({
  useAccountingSettingsOverview: () => ({
    data: {
      items: [
        {
          key: "coa",
          title: "Chart of Accounts",
          description: "Kelola akun transaksi utama",
          action_label: "Manage Accounts",
          href: "/bumdes/accounting/settings/chart-of-accounts",
        },
        {
          key: "taxes",
          title: "Taxes",
          description: "Kelola tarif pajak",
          action_label: "Manage Taxes",
          href: "/bumdes/accounting/settings/taxes",
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsCoa: () => ({
    data: {
      items: [
        {
          account_code: "1101",
          account_name: "Kas",
          account_type: "Asset",
          balance: 1000000,
          level: 1,
          is_active: true,
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsTaxes: () => ({
    data: {
      items: [
        {
          tax_id: "tax-ppn-11",
          tax_name: "PPN 11%",
          tax_type: "Sales",
          rate_percent: 11,
          tax_account: "2101",
          description: "Pajak penjualan",
          is_active: true,
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsCurrencies: () => ({
    data: {
      items: [
        {
          currency_code: "IDR",
          currency_name: "Rupiah",
          symbol: "Rp",
          exchange_rate: 1,
          is_base: true,
          auto_rate_update_enabled: false,
          last_updated_at: "2026-02-18T00:00:00Z",
          is_active: true,
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsAnalyticAccounts: () => ({
    data: {
      items: [
        {
          analytic_account_id: "an-001",
          account_name: "Marketing",
          reference_code: "MKT",
          status: "active",
          current_balance: 150000,
          active_budgets: 1,
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsBudgets: () => ({
    data: {
      items: [
        {
          budget_id: "bg-001",
          budget_name: "Q1 Campaign",
          analytic_account_id: "an-001",
          analytic_account_name: "Marketing",
          start_date: "2026-01-01",
          end_date: "2026-03-31",
          currency_code: "IDR",
          target_amount: 1000000,
          practical_amount: 250000,
          achievement_percent: 25,
          status: "active",
        },
      ],
    },
    error: null,
  }),
  useAccountingSettingsCoaMutations: () => ({
    createCoa: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateCoa: { mutateAsync: vi.fn().mockResolvedValue({}) },
    deleteCoa: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
  useAccountingSettingsTaxMutations: () => ({
    createTax: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateTax: { mutateAsync: vi.fn().mockResolvedValue({}) },
    toggleTaxStatus: { mutateAsync: vi.fn().mockResolvedValue({}) },
    duplicateTax: { mutateAsync: vi.fn().mockResolvedValue({}) },
    deleteTax: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
  useAccountingSettingsCurrencyMutations: () => ({
    createCurrency: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateCurrency: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateRates: { mutateAsync: vi.fn().mockResolvedValue({}) },
    toggleAutoRate: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
  useAccountingSettingsAnalyticMutations: () => ({
    createAnalyticAccount: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateAnalyticAccount: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
  useAccountingSettingsBudgetMutations: () => ({
    createBudget: { mutateAsync: vi.fn().mockResolvedValue({}) },
    updateBudget: { mutateAsync: vi.fn().mockResolvedValue({}) },
    deleteBudget: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
}));

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("accounting-settings foundation", () => {
  it("renders settings hub and child page containers", () => {
    const hub = renderWithQueryClient(<AccountingSettingsIndexPage />);
    expect(screen.getByRole("heading", { name: "Pengaturan Akuntansi" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Manage Accounts" }).getAttribute("href")).toBe(
      "/bumdes/accounting/settings/chart-of-accounts"
    );
    hub.unmount();

    const coa = renderWithQueryClient(<AccountingSettingsCoaPage />);
    expect(screen.getByRole("heading", { name: "Chart of Accounts (COA)" })).toBeTruthy();
    coa.unmount();

    const taxes = renderWithQueryClient(<AccountingSettingsTaxesPage />);
    expect(screen.getByRole("heading", { name: "Taxes" })).toBeTruthy();
    taxes.unmount();

    const currencies = renderWithQueryClient(<AccountingSettingsCurrenciesPage />);
    expect(screen.getByRole("heading", { name: "Currencies" })).toBeTruthy();
    currencies.unmount();

    renderWithQueryClient(<AccountingSettingsAnalyticBudgetPage />);
    expect(screen.getByRole("heading", { name: "Analytic & Budget" })).toBeTruthy();
  });

  it("keeps accounting settings submenu flat with four children", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const settingsItem = accountingItem?.items?.find((item) => item.name === "Settings");
    expect(settingsItem).toBeTruthy();

    const childLabels = (settingsItem?.items ?? []).map((item) => item.name);
    expect(childLabels).toEqual([
      "Chart of Accounts",
      "Taxes",
      "Currencies",
      "Analytic & Budget",
    ]);
  });

  it("registers title map entries for settings child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/settings"]).toBe("Accounting - Settings");
    expect(bumdesTitleMap["/bumdes/accounting/settings/chart-of-accounts"]).toBe(
      "Accounting - Settings - Chart of Accounts"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/taxes"]).toBe(
      "Accounting - Settings - Taxes"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/currencies"]).toBe(
      "Accounting - Settings - Currencies"
    );
    expect(bumdesTitleMap["/bumdes/accounting/settings/analytic-budgets"]).toBe(
      "Accounting - Settings - Analytic & Budget"
    );
  });
});
