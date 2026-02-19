/** @format */

import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";

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
          budget_name: "Q4 Sales Kickoff",
          analytic_account_id: "an-001",
          analytic_account_name: "Marketing",
          start_date: "2026-10-01",
          end_date: "2026-12-31",
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

describe("accounting-settings core features", () => {
  it("renders chart of accounts core table", () => {
    renderWithQueryClient(<AccountingSettingsCoaPage />);

    expect(screen.getByRole("heading", { name: "Chart of Accounts (COA)" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Add New Account" })).toBeTruthy();
    expect(screen.getByRole("columnheader", { name: "Code" })).toBeTruthy();
  });

  it("toggles tax status switch locally", () => {
    renderWithQueryClient(<AccountingSettingsTaxesPage />);

    const firstSwitch = screen.getAllByRole("switch")[0];
    expect(firstSwitch.getAttribute("data-state")).toBe("checked");

    fireEvent.click(firstSwitch);
    expect(firstSwitch.getAttribute("data-state")).toBe("unchecked");
  });

  it("shows currencies success toast after add action", async () => {
    renderWithQueryClient(<AccountingSettingsCurrenciesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Currency" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Currency" }));

    expect(await screen.findByText("New currency (GBP) has been added.")).toBeTruthy();
  });

  it("shows analytic budget success toast after create action", async () => {
    renderWithQueryClient(<AccountingSettingsAnalyticBudgetPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Budget" }));
    const dialog = await screen.findByRole("dialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Save Budget" }));

    expect(await screen.findByText('Budget "Q4 Sales Kickoff" has been created.')).toBeTruthy();
    expect(screen.getByPlaceholderText("Search budgets...")).toBeTruthy();
  });
});
