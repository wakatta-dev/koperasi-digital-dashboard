/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccountingSettingsAnalyticAccount,
  createAccountingSettingsBudget,
  createAccountingSettingsCoa,
  createAccountingSettingsCurrency,
  createAccountingSettingsTax,
  deleteAccountingSettingsBudget,
  deleteAccountingSettingsCoa,
  deleteAccountingSettingsTax,
  duplicateAccountingSettingsTax,
  ensureAccountingSettingsSuccess,
  getAccountingSettingsOverview,
  listAccountingSettingsAnalyticAccounts,
  listAccountingSettingsBudgets,
  listAccountingSettingsCoa,
  listAccountingSettingsCurrencies,
  listAccountingSettingsTaxes,
  toggleAccountingSettingsAutoRate,
  toggleAccountingSettingsTaxStatus,
  updateAccountingSettingsAnalyticAccount,
  updateAccountingSettingsBudget,
  updateAccountingSettingsCoa,
  updateAccountingSettingsCurrency,
  updateAccountingSettingsRates,
  updateAccountingSettingsTax,
} from "@/services/api/accounting-settings";
import type {
  AccountingSettingsAnalyticAccountListQuery,
  AccountingSettingsAnalyticAccountListResponse,
  AccountingSettingsBudgetListQuery,
  AccountingSettingsBudgetListResponse,
  AccountingSettingsCoaListQuery,
  AccountingSettingsCoaListResponse,
  AccountingSettingsCreateAnalyticAccountRequest,
  AccountingSettingsCreateAnalyticAccountResponse,
  AccountingSettingsCreateBudgetRequest,
  AccountingSettingsCreateBudgetResponse,
  AccountingSettingsCreateCoaRequest,
  AccountingSettingsCreateCoaResponse,
  AccountingSettingsCreateCurrencyRequest,
  AccountingSettingsCreateCurrencyResponse,
  AccountingSettingsCreateTaxRequest,
  AccountingSettingsCreateTaxResponse,
  AccountingSettingsCurrencyListQuery,
  AccountingSettingsCurrencyListResponse,
  AccountingSettingsDuplicateTaxResponse,
  AccountingSettingsOverviewResponse,
  AccountingSettingsTaxListQuery,
  AccountingSettingsTaxListResponse,
  AccountingSettingsToggleAutoRateResponse,
  AccountingSettingsToggleTaxStatusResponse,
  AccountingSettingsUpdateAnalyticAccountRequest,
  AccountingSettingsUpdateAnalyticAccountResponse,
  AccountingSettingsUpdateBudgetRequest,
  AccountingSettingsUpdateBudgetResponse,
  AccountingSettingsUpdateCoaRequest,
  AccountingSettingsUpdateCoaResponse,
  AccountingSettingsUpdateCurrencyRequest,
  AccountingSettingsUpdateCurrencyResponse,
  AccountingSettingsUpdateRatesResponse,
  AccountingSettingsUpdateTaxRequest,
  AccountingSettingsUpdateTaxResponse,
} from "@/types/api/accounting-settings";

import { QK } from "./queryKeys";

export function useAccountingSettingsOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.accountingSettings.overview(),
    queryFn: async (): Promise<AccountingSettingsOverviewResponse> =>
      ensureAccountingSettingsSuccess(await getAccountingSettingsOverview()),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsCoa(
  params?: AccountingSettingsCoaListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingSettingsCoaListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingSettings.coa(normalized),
    queryFn: async (): Promise<AccountingSettingsCoaListResponse> =>
      ensureAccountingSettingsSuccess(await listAccountingSettingsCoa(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsTaxes(
  params?: AccountingSettingsTaxListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingSettingsTaxListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingSettings.taxes(normalized),
    queryFn: async (): Promise<AccountingSettingsTaxListResponse> =>
      ensureAccountingSettingsSuccess(await listAccountingSettingsTaxes(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsCurrencies(
  params?: AccountingSettingsCurrencyListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingSettingsCurrencyListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingSettings.currencies(normalized),
    queryFn: async (): Promise<AccountingSettingsCurrencyListResponse> =>
      ensureAccountingSettingsSuccess(await listAccountingSettingsCurrencies(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsAnalyticAccounts(
  params?: AccountingSettingsAnalyticAccountListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingSettingsAnalyticAccountListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingSettings.analyticAccounts(normalized),
    queryFn: async (): Promise<AccountingSettingsAnalyticAccountListResponse> =>
      ensureAccountingSettingsSuccess(await listAccountingSettingsAnalyticAccounts(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsBudgets(
  params?: AccountingSettingsBudgetListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingSettingsBudgetListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingSettings.budgets(normalized),
    queryFn: async (): Promise<AccountingSettingsBudgetListResponse> =>
      ensureAccountingSettingsSuccess(await listAccountingSettingsBudgets(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingSettingsCoaMutations() {
  const qc = useQueryClient();

  const createCoa = useMutation({
    mutationFn: async (vars: {
      payload: AccountingSettingsCreateCoaRequest;
      idempotencyKey?: string;
    }): Promise<AccountingSettingsCreateCoaResponse> =>
      ensureAccountingSettingsSuccess(
        await createAccountingSettingsCoa(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.coa() });
    },
  });

  const updateCoa = useMutation({
    mutationFn: async (vars: {
      accountCode: string;
      payload: AccountingSettingsUpdateCoaRequest;
    }): Promise<AccountingSettingsUpdateCoaResponse> =>
      ensureAccountingSettingsSuccess(await updateAccountingSettingsCoa(vars.accountCode, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.coa() });
    },
  });

  const deleteCoa = useMutation({
    mutationFn: async (vars: { accountCode: string }) =>
      ensureAccountingSettingsSuccess(await deleteAccountingSettingsCoa(vars.accountCode)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.coa() });
    },
  });

  return {
    createCoa,
    updateCoa,
    deleteCoa,
  } as const;
}

export function useAccountingSettingsTaxMutations() {
  const qc = useQueryClient();

  const createTax = useMutation({
    mutationFn: async (vars: {
      payload: AccountingSettingsCreateTaxRequest;
      idempotencyKey?: string;
    }): Promise<AccountingSettingsCreateTaxResponse> =>
      ensureAccountingSettingsSuccess(
        await createAccountingSettingsTax(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.taxes() });
    },
  });

  const updateTax = useMutation({
    mutationFn: async (vars: {
      taxId: string;
      payload: AccountingSettingsUpdateTaxRequest;
    }): Promise<AccountingSettingsUpdateTaxResponse> =>
      ensureAccountingSettingsSuccess(await updateAccountingSettingsTax(vars.taxId, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.taxes() });
    },
  });

  const toggleTaxStatus = useMutation({
    mutationFn: async (vars: {
      taxId: string;
      isActive: boolean;
    }): Promise<AccountingSettingsToggleTaxStatusResponse> =>
      ensureAccountingSettingsSuccess(
        await toggleAccountingSettingsTaxStatus(vars.taxId, {
          is_active: vars.isActive,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.taxes() });
    },
  });

  const duplicateTax = useMutation({
    mutationFn: async (vars: {
      taxId: string;
      newName?: string;
    }): Promise<AccountingSettingsDuplicateTaxResponse> =>
      ensureAccountingSettingsSuccess(
        await duplicateAccountingSettingsTax(vars.taxId, {
          new_name: vars.newName,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.taxes() });
    },
  });

  const deleteTax = useMutation({
    mutationFn: async (vars: { taxId: string }) =>
      ensureAccountingSettingsSuccess(await deleteAccountingSettingsTax(vars.taxId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.taxes() });
    },
  });

  return {
    createTax,
    updateTax,
    toggleTaxStatus,
    duplicateTax,
    deleteTax,
  } as const;
}

export function useAccountingSettingsCurrencyMutations() {
  const qc = useQueryClient();

  const createCurrency = useMutation({
    mutationFn: async (vars: {
      payload: AccountingSettingsCreateCurrencyRequest;
      idempotencyKey?: string;
    }): Promise<AccountingSettingsCreateCurrencyResponse> =>
      ensureAccountingSettingsSuccess(
        await createAccountingSettingsCurrency(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.currencies() });
    },
  });

  const updateCurrency = useMutation({
    mutationFn: async (vars: {
      currencyCode: string;
      payload: AccountingSettingsUpdateCurrencyRequest;
    }): Promise<AccountingSettingsUpdateCurrencyResponse> =>
      ensureAccountingSettingsSuccess(
        await updateAccountingSettingsCurrency(vars.currencyCode, vars.payload)
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.currencies() });
    },
  });

  const updateRates = useMutation({
    mutationFn: async (vars?: { codes?: string[] }): Promise<AccountingSettingsUpdateRatesResponse> =>
      ensureAccountingSettingsSuccess(
        await updateAccountingSettingsRates({
          codes: vars?.codes,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.currencies() });
    },
  });

  const toggleAutoRate = useMutation({
    mutationFn: async (vars: {
      currencyCode: string;
      enabled: boolean;
    }): Promise<AccountingSettingsToggleAutoRateResponse> =>
      ensureAccountingSettingsSuccess(
        await toggleAccountingSettingsAutoRate(vars.currencyCode, {
          auto_rate_update_enabled: vars.enabled,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.currencies() });
    },
  });

  return {
    createCurrency,
    updateCurrency,
    updateRates,
    toggleAutoRate,
  } as const;
}

export function useAccountingSettingsAnalyticMutations() {
  const qc = useQueryClient();

  const createAnalyticAccount = useMutation({
    mutationFn: async (vars: {
      payload: AccountingSettingsCreateAnalyticAccountRequest;
      idempotencyKey?: string;
    }): Promise<AccountingSettingsCreateAnalyticAccountResponse> =>
      ensureAccountingSettingsSuccess(
        await createAccountingSettingsAnalyticAccount(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.analyticAccounts() });
    },
  });

  const updateAnalyticAccount = useMutation({
    mutationFn: async (vars: {
      analyticAccountId: string;
      payload: AccountingSettingsUpdateAnalyticAccountRequest;
    }): Promise<AccountingSettingsUpdateAnalyticAccountResponse> =>
      ensureAccountingSettingsSuccess(
        await updateAccountingSettingsAnalyticAccount(vars.analyticAccountId, vars.payload)
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.analyticAccounts() });
    },
  });

  return {
    createAnalyticAccount,
    updateAnalyticAccount,
  } as const;
}

export function useAccountingSettingsBudgetMutations() {
  const qc = useQueryClient();

  const createBudget = useMutation({
    mutationFn: async (vars: {
      payload: AccountingSettingsCreateBudgetRequest;
      idempotencyKey?: string;
    }): Promise<AccountingSettingsCreateBudgetResponse> =>
      ensureAccountingSettingsSuccess(
        await createAccountingSettingsBudget(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.budgets() });
      qc.invalidateQueries({ queryKey: QK.accountingSettings.analyticAccounts() });
    },
  });

  const updateBudget = useMutation({
    mutationFn: async (vars: {
      budgetId: string;
      payload: AccountingSettingsUpdateBudgetRequest;
    }): Promise<AccountingSettingsUpdateBudgetResponse> =>
      ensureAccountingSettingsSuccess(await updateAccountingSettingsBudget(vars.budgetId, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.budgets() });
    },
  });

  const deleteBudget = useMutation({
    mutationFn: async (vars: { budgetId: string }) =>
      ensureAccountingSettingsSuccess(await deleteAccountingSettingsBudget(vars.budgetId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingSettings.budgets() });
    },
  });

  return {
    createBudget,
    updateBudget,
    deleteBudget,
  } as const;
}
