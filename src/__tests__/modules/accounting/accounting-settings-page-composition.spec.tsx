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

describe("accounting-settings page composition", () => {
  it("opens add coa modal from coa page", async () => {
    renderWithQueryClient(<AccountingSettingsCoaPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add New Account" }));

    expect(await screen.findByRole("heading", { name: "Tambah Akun Baru" })).toBeTruthy();
  });

  it("opens create and edit tax modals from taxes page interactions", async () => {
    renderWithQueryClient(<AccountingSettingsTaxesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Tax" }));
    expect(await screen.findByRole("heading", { name: "Tambah Pajak Baru" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(screen.getAllByRole("button", { name: "Open tax actions" }).length).toBeGreaterThan(0);
  });

  it("opens add currency modal and shows success toast after submit", async () => {
    renderWithQueryClient(<AccountingSettingsCurrenciesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Currency" }));
    const dialog = await screen.findByRole("dialog", { name: "Add New Currency" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Currency" }));

    expect(await screen.findByText("New currency (GBP) has been added.")).toBeTruthy();
  });

  it("opens budget and analytic account modals on analytic & budget page", async () => {
    renderWithQueryClient(<AccountingSettingsAnalyticBudgetPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Budget" }));
    expect(await screen.findByRole("heading", { name: "Create New Budget" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    fireEvent.click(screen.getByRole("tab", { name: "Analytic Accounts" }));
    fireEvent.click(screen.getByRole("button", { name: "Add Analytic Account" }));

    expect(await screen.findByRole("heading", { name: "Add Analytic Account" })).toBeTruthy();
  });
});
