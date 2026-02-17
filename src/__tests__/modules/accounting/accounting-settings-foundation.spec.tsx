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
  useAccountingSettingsOverview: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsCoa: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsTaxes: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsCurrencies: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsAnalyticAccounts: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsBudgets: () => ({ data: { items: [] }, error: null }),
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
