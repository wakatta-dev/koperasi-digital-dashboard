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
