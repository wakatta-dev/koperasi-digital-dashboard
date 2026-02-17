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
