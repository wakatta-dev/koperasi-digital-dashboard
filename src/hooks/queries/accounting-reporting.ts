/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";

import {
  ensureAccountingReportingSuccess,
  getAccountingReportingAccountLedger,
  getAccountingReportingBalanceSheet,
  getAccountingReportingCashFlow,
  getAccountingReportingGeneralLedger,
  getAccountingReportingOverview,
  getAccountingReportingProfitLoss,
  getAccountingReportingProfitLossComparative,
  getAccountingReportingTrialBalance,
} from "@/services/api/accounting-reporting";
import type {
  AccountingReportingAccountLedgerQuery,
  AccountingReportingAccountLedgerResponse,
  AccountingReportingBalanceSheetResponse,
  AccountingReportingCashFlowResponse,
  AccountingReportingGeneralLedgerQuery,
  AccountingReportingGeneralLedgerResponse,
  AccountingReportingOverviewResponse,
  AccountingReportingProfitLossComparativeResponse,
  AccountingReportingProfitLossResponse,
  AccountingReportingTrialBalanceResponse,
  AccountingReportingBaseQuery,
} from "@/types/api/accounting-reporting";

import { QK } from "./queryKeys";

export function useAccountingReportingOverview(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.overview(params ?? {}),
    queryFn: async (): Promise<AccountingReportingOverviewResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingOverview(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingProfitLoss(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.profitLoss(params ?? {}),
    queryFn: async (): Promise<AccountingReportingProfitLossResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingProfitLoss(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingCashFlow(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.cashFlow(params ?? {}),
    queryFn: async (): Promise<AccountingReportingCashFlowResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingCashFlow(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingBalanceSheet(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.balanceSheet(params ?? {}),
    queryFn: async (): Promise<AccountingReportingBalanceSheetResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingBalanceSheet(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingProfitLossComparative(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.profitLossComparative(params ?? {}),
    queryFn: async (): Promise<AccountingReportingProfitLossComparativeResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingProfitLossComparative(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingTrialBalance(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: QK.accountingReporting.trialBalance(params ?? {}),
    queryFn: async (): Promise<AccountingReportingTrialBalanceResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingTrialBalance(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingGeneralLedger(
  params?: AccountingReportingGeneralLedgerQuery,
  options?: { enabled?: boolean },
) {
  const normalized: AccountingReportingGeneralLedgerQuery = {
    page: params?.page ?? 1,
    page_size: params?.page_size ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingReporting.generalLedger(normalized),
    queryFn: async (): Promise<AccountingReportingGeneralLedgerResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingGeneralLedger(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingReportingAccountLedger(
  params?: AccountingReportingAccountLedgerQuery,
  options?: { enabled?: boolean },
) {
  const normalized = params
    ? {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        ...params,
      }
    : undefined;

  return useQuery({
    queryKey: QK.accountingReporting.accountLedger(normalized ?? {}),
    enabled: Boolean(normalized?.accountId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingAccountLedgerResponse> => {
      if (!normalized?.accountId) {
        throw new Error("accountId is required");
      }
      return ensureAccountingReportingSuccess(await getAccountingReportingAccountLedger(normalized));
    },
  });
}
