/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  confirmAccountingBankCashReconciliation,
  createAccountingBankCashAccount,
  createAccountingBankCashManualTransaction,
  createAccountingBankCashMatches,
  ensureAccountingBankCashSuccess,
  exportAccountingBankCashAccountTransactions,
  getAccountingBankCashOverview,
  getAccountingBankCashReconciliationSession,
  importAccountingBankCashStatement,
  listAccountingBankCashAccountTransactions,
  listAccountingBankCashAccounts,
  listAccountingBankCashBankLines,
  listAccountingBankCashSystemLines,
  listAccountingBankCashUnreconciledTransactions,
  suggestAccountingBankCashMatches,
} from "@/services/api/accounting-bank-cash";
import type {
  AccountingBankCashAccountsQuery,
  AccountingBankCashAccountsResponse,
  AccountingBankCashBankLinesResponse,
  AccountingBankCashConfirmReconciliationRequest,
  AccountingBankCashConfirmReconciliationResponse,
  AccountingBankCashCreateAccountRequest,
  AccountingBankCashCreateAccountResponse,
  AccountingBankCashCreateMatchesRequest,
  AccountingBankCashCreateMatchesResponse,
  AccountingBankCashExportTransactionsQuery,
  AccountingBankCashExportTransactionsResponse,
  AccountingBankCashImportStatementRequest,
  AccountingBankCashImportStatementResponse,
  AccountingBankCashManualTransactionRequest,
  AccountingBankCashManualTransactionResponse,
  AccountingBankCashOverviewResponse,
  AccountingBankCashReconciliationLinesQuery,
  AccountingBankCashReconciliationSessionResponse,
  AccountingBankCashSuggestMatchesRequest,
  AccountingBankCashSuggestMatchesResponse,
  AccountingBankCashSystemLinesResponse,
  AccountingBankCashTransactionsQuery,
  AccountingBankCashTransactionsResponse,
  AccountingBankCashUnreconciledQuery,
  AccountingBankCashUnreconciledResponse,
} from "@/types/api/accounting-bank-cash";

import { QK } from "./queryKeys";

export function useAccountingBankCashOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.accountingBankCash.overview(),
    queryFn: async (): Promise<AccountingBankCashOverviewResponse> =>
      ensureAccountingBankCashSuccess(await getAccountingBankCashOverview()),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingBankCashAccounts(
  params?: AccountingBankCashAccountsQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingBankCashAccountsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingBankCash.accounts(normalized),
    queryFn: async (): Promise<AccountingBankCashAccountsResponse> =>
      ensureAccountingBankCashSuccess(await listAccountingBankCashAccounts(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingBankCashUnreconciledTransactions(
  params?: AccountingBankCashUnreconciledQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingBankCashUnreconciledQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingBankCash.unreconciledTransactions(normalized),
    queryFn: async (): Promise<AccountingBankCashUnreconciledResponse> =>
      ensureAccountingBankCashSuccess(
        await listAccountingBankCashUnreconciledTransactions(normalized)
      ),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingBankCashReconciliationSession(
  accountId?: string,
  options?: { enabled?: boolean }
) {
  const normalizedAccountId = (accountId ?? "").trim();

  return useQuery({
    queryKey: QK.accountingBankCash.reconciliationSession(normalizedAccountId),
    enabled: Boolean(normalizedAccountId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingBankCashReconciliationSessionResponse> =>
      ensureAccountingBankCashSuccess(
        await getAccountingBankCashReconciliationSession(normalizedAccountId)
      ),
  });
}

export function useAccountingBankCashBankLines(
  accountId?: string,
  params?: AccountingBankCashReconciliationLinesQuery,
  options?: { enabled?: boolean }
) {
  const normalizedAccountId = (accountId ?? "").trim();
  const normalizedParams: AccountingBankCashReconciliationLinesQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingBankCash.bankLines(normalizedAccountId, normalizedParams),
    enabled: Boolean(normalizedAccountId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingBankCashBankLinesResponse> =>
      ensureAccountingBankCashSuccess(
        await listAccountingBankCashBankLines(normalizedAccountId, normalizedParams)
      ),
  });
}

export function useAccountingBankCashSystemLines(
  accountId?: string,
  params?: AccountingBankCashReconciliationLinesQuery,
  options?: { enabled?: boolean }
) {
  const normalizedAccountId = (accountId ?? "").trim();
  const normalizedParams: AccountingBankCashReconciliationLinesQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingBankCash.systemLines(normalizedAccountId, normalizedParams),
    enabled: Boolean(normalizedAccountId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingBankCashSystemLinesResponse> =>
      ensureAccountingBankCashSuccess(
        await listAccountingBankCashSystemLines(normalizedAccountId, normalizedParams)
      ),
  });
}

export function useAccountingBankCashAccountTransactions(
  accountId?: string,
  params?: AccountingBankCashTransactionsQuery,
  options?: { enabled?: boolean }
) {
  const normalizedAccountId = (accountId ?? "").trim();
  const normalizedParams: AccountingBankCashTransactionsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingBankCash.accountTransactions(normalizedAccountId, normalizedParams),
    enabled: Boolean(normalizedAccountId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingBankCashTransactionsResponse> =>
      ensureAccountingBankCashSuccess(
        await listAccountingBankCashAccountTransactions(normalizedAccountId, normalizedParams)
      ),
  });
}

export function useAccountingBankCashMutations() {
  const qc = useQueryClient();

  const createAccount = useMutation({
    mutationFn: async (vars: {
      payload: AccountingBankCashCreateAccountRequest;
      idempotencyKey?: string;
    }): Promise<AccountingBankCashCreateAccountResponse> =>
      ensureAccountingBankCashSuccess(
        await createAccountingBankCashAccount(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.accounts() });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.overview() });
    },
  });

  const importStatement = useMutation({
    mutationFn: async (vars: {
      payload: AccountingBankCashImportStatementRequest;
      idempotencyKey?: string;
    }): Promise<AccountingBankCashImportStatementResponse> =>
      ensureAccountingBankCashSuccess(
        await importAccountingBankCashStatement(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.reconciliationSession(vars.payload.account_id) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.bankLines(vars.payload.account_id) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.unreconciledTransactions() });
    },
  });

  const createMatches = useMutation({
    mutationFn: async (vars: {
      accountId: string;
      payload: AccountingBankCashCreateMatchesRequest;
    }): Promise<AccountingBankCashCreateMatchesResponse> =>
      ensureAccountingBankCashSuccess(
        await createAccountingBankCashMatches(vars.accountId, vars.payload)
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.reconciliationSession(vars.accountId) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.bankLines(vars.accountId) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.systemLines(vars.accountId) });
    },
  });

  const suggestMatches = useMutation({
    mutationFn: async (vars: {
      accountId: string;
      payload: AccountingBankCashSuggestMatchesRequest;
    }): Promise<AccountingBankCashSuggestMatchesResponse> =>
      ensureAccountingBankCashSuccess(
        await suggestAccountingBankCashMatches(vars.accountId, vars.payload)
      ),
  });

  const confirmReconciliation = useMutation({
    mutationFn: async (vars: {
      accountId: string;
      payload: AccountingBankCashConfirmReconciliationRequest;
      idempotencyKey?: string;
    }): Promise<AccountingBankCashConfirmReconciliationResponse> =>
      ensureAccountingBankCashSuccess(
        await confirmAccountingBankCashReconciliation(vars.accountId, vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.reconciliationSession(vars.accountId) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.accountTransactions(vars.accountId) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.unreconciledTransactions() });
    },
  });

  const createManualTransaction = useMutation({
    mutationFn: async (vars: {
      accountId: string;
      payload: AccountingBankCashManualTransactionRequest;
      idempotencyKey?: string;
    }): Promise<AccountingBankCashManualTransactionResponse> =>
      ensureAccountingBankCashSuccess(
        await createAccountingBankCashManualTransaction(vars.accountId, vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.accountTransactions(vars.accountId) });
      qc.invalidateQueries({ queryKey: QK.accountingBankCash.unreconciledTransactions() });
    },
  });

  const exportTransactions = useMutation({
    mutationFn: async (vars: {
      accountId: string;
      params: AccountingBankCashExportTransactionsQuery;
    }): Promise<AccountingBankCashExportTransactionsResponse> =>
      ensureAccountingBankCashSuccess(
        await exportAccountingBankCashAccountTransactions(vars.accountId, vars.params)
      ),
  });

  return {
    createAccount,
    importStatement,
    createMatches,
    suggestMatches,
    confirmReconciliation,
    createManualTransaction,
    exportTransactions,
  } as const;
}
