/** @format */

import { fireEvent, render, screen, within } from "@testing-library/react";
import { vi } from "vitest";

import { AccountingSettingsApiError } from "@/services/api/accounting-settings";
import {
  AccountingSettingsAnalyticBudgetPage,
  AccountingSettingsCoaPage,
  AccountingSettingsCurrenciesPage,
  AccountingSettingsTaxesPage,
} from "@/modules/accounting";

const {
  createCoaMutateAsync,
  createTaxMutateAsync,
  createCurrencyMutateAsync,
  createBudgetMutateAsync,
} = vi.hoisted(() => ({
  createCoaMutateAsync: vi.fn(),
  createTaxMutateAsync: vi.fn(),
  createCurrencyMutateAsync: vi.fn(),
  createBudgetMutateAsync: vi.fn(),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingSettingsOverview: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsCoa: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsCoaMutations: () => ({
    createCoa: { mutateAsync: createCoaMutateAsync },
    updateCoa: { mutateAsync: vi.fn() },
    deleteCoa: { mutateAsync: vi.fn() },
  }),
  useAccountingSettingsTaxes: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsTaxMutations: () => ({
    createTax: { mutateAsync: createTaxMutateAsync },
    updateTax: { mutateAsync: vi.fn() },
    toggleTaxStatus: { mutateAsync: vi.fn() },
    duplicateTax: { mutateAsync: vi.fn() },
    deleteTax: { mutateAsync: vi.fn() },
  }),
  useAccountingSettingsCurrencies: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsCurrencyMutations: () => ({
    createCurrency: { mutateAsync: createCurrencyMutateAsync },
    updateCurrency: { mutateAsync: vi.fn() },
    updateRates: { mutateAsync: vi.fn() },
    toggleAutoRate: { mutateAsync: vi.fn() },
  }),
  useAccountingSettingsAnalyticAccounts: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsBudgets: () => ({ data: { items: [] }, error: null }),
  useAccountingSettingsAnalyticMutations: () => ({
    createAnalyticAccount: { mutateAsync: vi.fn() },
    updateAnalyticAccount: { mutateAsync: vi.fn() },
  }),
  useAccountingSettingsBudgetMutations: () => ({
    createBudget: { mutateAsync: createBudgetMutateAsync },
    updateBudget: { mutateAsync: vi.fn() },
    deleteBudget: { mutateAsync: vi.fn() },
  }),
}));

describe("accounting-settings integration errors", () => {
  beforeEach(() => {
    createCoaMutateAsync.mockReset();
    createTaxMutateAsync.mockReset();
    createCurrencyMutateAsync.mockReset();
    createBudgetMutateAsync.mockReset();
  });

  it("shows 409 error message on create coa account", async () => {
    createCoaMutateAsync.mockRejectedValueOnce(
      new AccountingSettingsApiError({
        message: "duplicate account code",
        statusCode: 409,
      })
    );

    render(<AccountingSettingsCoaPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add New Account" }));
    fireEvent.click(screen.getByRole("button", { name: "Simpan Akun" }));

    expect(await screen.findByText("duplicate account code")).toBeTruthy();
  });

  it("shows 422 error message on create tax", async () => {
    createTaxMutateAsync.mockRejectedValueOnce(
      new AccountingSettingsApiError({
        message: "invalid tax rate",
        statusCode: 422,
      })
    );

    render(<AccountingSettingsTaxesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Tax" }));
    fireEvent.click(screen.getByRole("button", { name: "Simpan Pajak" }));

    expect(await screen.findByText("invalid tax rate")).toBeTruthy();
  });

  it("shows 409 error message on add currency", async () => {
    createCurrencyMutateAsync.mockRejectedValueOnce(
      new AccountingSettingsApiError({
        message: "duplicate currency code",
        statusCode: 409,
      })
    );

    render(<AccountingSettingsCurrenciesPage />);

    fireEvent.click(screen.getByRole("button", { name: "Add Currency" }));
    const dialog = await screen.findByRole("dialog", { name: "Add New Currency" });
    fireEvent.click(within(dialog).getByRole("button", { name: "Add Currency" }));

    expect(await screen.findByText("duplicate currency code")).toBeTruthy();
  });

  it("shows 422 error message on create budget", async () => {
    createBudgetMutateAsync.mockRejectedValueOnce(
      new AccountingSettingsApiError({
        message: "invalid budget period",
        statusCode: 422,
      })
    );

    render(<AccountingSettingsAnalyticBudgetPage />);

    fireEvent.click(screen.getByRole("button", { name: "Create Budget" }));
    fireEvent.click(screen.getByRole("button", { name: "Save Budget" }));

    expect(await screen.findByText("invalid budget period")).toBeTruthy();
  });
});
