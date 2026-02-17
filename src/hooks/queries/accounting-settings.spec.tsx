/** @format */

import type { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { QK } from "./queryKeys";

const {
  getOverviewMock,
  listCoaMock,
  listTaxesMock,
  listCurrenciesMock,
  listAnalyticAccountsMock,
  listBudgetsMock,
  createCoaMock,
  updateCoaMock,
  deleteCoaMock,
  createTaxMock,
  updateTaxMock,
  toggleTaxStatusMock,
  duplicateTaxMock,
  deleteTaxMock,
  createCurrencyMock,
  updateCurrencyMock,
  updateRatesMock,
  toggleAutoRateMock,
  createAnalyticMock,
  updateAnalyticMock,
  createBudgetMock,
  updateBudgetMock,
  deleteBudgetMock,
} = vi.hoisted(() => ({
  getOverviewMock: vi.fn(),
  listCoaMock: vi.fn(),
  listTaxesMock: vi.fn(),
  listCurrenciesMock: vi.fn(),
  listAnalyticAccountsMock: vi.fn(),
  listBudgetsMock: vi.fn(),
  createCoaMock: vi.fn(),
  updateCoaMock: vi.fn(),
  deleteCoaMock: vi.fn(),
  createTaxMock: vi.fn(),
  updateTaxMock: vi.fn(),
  toggleTaxStatusMock: vi.fn(),
  duplicateTaxMock: vi.fn(),
  deleteTaxMock: vi.fn(),
  createCurrencyMock: vi.fn(),
  updateCurrencyMock: vi.fn(),
  updateRatesMock: vi.fn(),
  toggleAutoRateMock: vi.fn(),
  createAnalyticMock: vi.fn(),
  updateAnalyticMock: vi.fn(),
  createBudgetMock: vi.fn(),
  updateBudgetMock: vi.fn(),
  deleteBudgetMock: vi.fn(),
}));

vi.mock("@/services/api/accounting-settings", () => ({
  ensureAccountingSettingsSuccess: (response: any) => {
    if (!response.success) {
      throw new Error(response.message || "failed");
    }
    return response.data;
  },
  getAccountingSettingsOverview: getOverviewMock,
  listAccountingSettingsCoa: listCoaMock,
  listAccountingSettingsTaxes: listTaxesMock,
  listAccountingSettingsCurrencies: listCurrenciesMock,
  listAccountingSettingsAnalyticAccounts: listAnalyticAccountsMock,
  listAccountingSettingsBudgets: listBudgetsMock,
  createAccountingSettingsCoa: createCoaMock,
  updateAccountingSettingsCoa: updateCoaMock,
  deleteAccountingSettingsCoa: deleteCoaMock,
  createAccountingSettingsTax: createTaxMock,
  updateAccountingSettingsTax: updateTaxMock,
  toggleAccountingSettingsTaxStatus: toggleTaxStatusMock,
  duplicateAccountingSettingsTax: duplicateTaxMock,
  deleteAccountingSettingsTax: deleteTaxMock,
  createAccountingSettingsCurrency: createCurrencyMock,
  updateAccountingSettingsCurrency: updateCurrencyMock,
  updateAccountingSettingsRates: updateRatesMock,
  toggleAccountingSettingsAutoRate: toggleAutoRateMock,
  createAccountingSettingsAnalyticAccount: createAnalyticMock,
  updateAccountingSettingsAnalyticAccount: updateAnalyticMock,
  createAccountingSettingsBudget: createBudgetMock,
  updateAccountingSettingsBudget: updateBudgetMock,
  deleteAccountingSettingsBudget: deleteBudgetMock,
}));

import {
  useAccountingSettingsCoaMutations,
  useAccountingSettingsOverview,
  useAccountingSettingsTaxMutations,
} from "./accounting-settings";

describe("accounting-settings query hooks", () => {
  beforeEach(() => {
    getOverviewMock.mockReset();
    listCoaMock.mockReset();
    listTaxesMock.mockReset();
    listCurrenciesMock.mockReset();
    listAnalyticAccountsMock.mockReset();
    listBudgetsMock.mockReset();
    createCoaMock.mockReset();
    updateCoaMock.mockReset();
    deleteCoaMock.mockReset();
    createTaxMock.mockReset();
    updateTaxMock.mockReset();
    toggleTaxStatusMock.mockReset();
    duplicateTaxMock.mockReset();
    deleteTaxMock.mockReset();
    createCurrencyMock.mockReset();
    updateCurrencyMock.mockReset();
    updateRatesMock.mockReset();
    toggleAutoRateMock.mockReset();
    createAnalyticMock.mockReset();
    updateAnalyticMock.mockReset();
    createBudgetMock.mockReset();
    updateBudgetMock.mockReset();
    deleteBudgetMock.mockReset();
  });

  function makeWrapper(queryClient: QueryClient) {
    return function Wrapper({ children }: PropsWithChildren) {
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
    };
  }

  it("loads settings overview data with query key scope", async () => {
    getOverviewMock.mockResolvedValueOnce({
      success: true,
      data: {
        items: [
          {
            key: "coa",
            title: "Chart of Accounts (COA)",
            description: "Management of the general ledger accounts structure, hierarchy, and types.",
            action_label: "Manage Accounts",
            href: "/bumdes/accounting/settings/chart-of-accounts",
          },
        ],
      },
    });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { result } = renderHook(() => useAccountingSettingsOverview(), {
      wrapper: makeWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items[0]?.key).toBe("coa");
    expect(client.getQueryData(QK.accountingSettings.overview())).toBeTruthy();
  });

  it("creates coa account and invalidates coa query key", async () => {
    createCoaMock.mockResolvedValueOnce({
      success: true,
      data: {
        account_code: "11103",
        account_name: "Mandiri Bank",
        account_type: "Asset",
      },
    });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useAccountingSettingsCoaMutations(), {
      wrapper: makeWrapper(client),
    });

    await act(async () => {
      await result.current.createCoa.mutateAsync({
        payload: {
          account_code: "11103",
          account_name: "Mandiri Bank",
          account_type: "Asset",
        },
      });
    });

    expect(createCoaMock).toHaveBeenCalledWith(
      {
        account_code: "11103",
        account_name: "Mandiri Bank",
        account_type: "Asset",
      },
      {
        idempotencyKey: undefined,
      }
    );
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: QK.accountingSettings.coa() });
  });

  it("toggles tax status through tax mutation hook", async () => {
    toggleTaxStatusMock.mockResolvedValueOnce({
      success: true,
      data: {
        tax_id: "tax-1",
        is_active: false,
      },
    });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });

    const { result } = renderHook(() => useAccountingSettingsTaxMutations(), {
      wrapper: makeWrapper(client),
    });

    await act(async () => {
      await result.current.toggleTaxStatus.mutateAsync({
        taxId: "tax-1",
        isActive: false,
      });
    });

    expect(toggleTaxStatusMock).toHaveBeenCalledWith("tax-1", {
      is_active: false,
    });
  });
});
