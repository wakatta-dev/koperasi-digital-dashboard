/** @format */

import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { AccountingSettingsFeatureDemo } from "@/modules/accounting";

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

describe("accounting-settings demo", () => {
  it("renders demo wrapper with stitch heading", () => {
    renderWithQueryClient(<AccountingSettingsFeatureDemo />);

    expect(screen.getAllByRole("heading", { name: "Pengaturan Akuntansi" }).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Konfigurasi modul akuntansi, pajak, mata uang, dan anggaran.").length).toBeGreaterThan(0);
  });

  it("switches between settings views with local state", () => {
    renderWithQueryClient(<AccountingSettingsFeatureDemo />);

    fireEvent.click(screen.getByRole("button", { name: "Taxes" }));
    expect(screen.getByRole("heading", { name: "Taxes" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Currencies" }));
    expect(screen.getByRole("heading", { name: "Currencies" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Analytic & Budget" }));
    expect(screen.getByRole("heading", { name: "Analytic & Budget" })).toBeTruthy();
  });
});
