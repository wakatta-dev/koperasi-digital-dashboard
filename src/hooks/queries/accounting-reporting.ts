/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  ensureAccountingReportingSuccess,
  getAccountingReportingAccountLedger,
  getAccountingReportingBalanceSheet,
  getAccountingReportingCashFlow,
  getAccountingReportingGeneralLedger,
  getAccountingReportingOverview,
  getAccountingReportingProfitLoss,
  getAccountingReportingProfitLossComparative,
  getAccountingReportingTieOut,
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
  AccountingReportingTieOutResponse,
  AccountingReportingTrialBalanceResponse,
  AccountingReportingBaseQuery,
} from "@/types/api/accounting-reporting";

import { QK } from "./queryKeys";

export function useAccountingReportingOverview(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.overview(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingOverviewResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingOverview(params)),
    retry: false,
  });
}

export function useAccountingReportingProfitLoss(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.profitLoss(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingProfitLossResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingProfitLoss(params)),
    retry: false,
  });
}

export function useAccountingReportingCashFlow(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.cashFlow(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingCashFlowResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingCashFlow(params)),
    retry: false,
  });
}

export function useAccountingReportingBalanceSheet(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.balanceSheet(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingBalanceSheetResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingBalanceSheet(params)),
    retry: false,
  });
}

export function useAccountingReportingProfitLossComparative(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.profitLossComparative(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingProfitLossComparativeResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingProfitLossComparative(params)),
    retry: false,
  });
}

export function useAccountingReportingTrialBalance(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.trialBalance(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingTrialBalanceResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingTrialBalance(params)),
    retry: false,
  });
}

export function useAccountingReportingTieOut(
  params?: AccountingReportingBaseQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  return useQuery({
    queryKey: QK.accountingReporting.tieOut(params ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingTieOutResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingTieOut(params)),
    retry: false,
  });
}

export function useAccountingReportingGeneralLedger(
  params?: AccountingReportingGeneralLedgerQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  const normalized: AccountingReportingGeneralLedgerQuery = {
    page: params?.page ?? 1,
    page_size: params?.page_size ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingReporting.generalLedger(normalized),
    queryFn: async (): Promise<AccountingReportingGeneralLedgerResponse> =>
      ensureAccountingReportingSuccess(await getAccountingReportingGeneralLedger(normalized)),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      (options?.enabled ?? true),
    retry: false,
  });
}

export function useAccountingReportingAccountLedger(
  params?: AccountingReportingAccountLedgerQuery,
  options?: { enabled?: boolean },
) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);
  const normalized = params
    ? {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        ...params,
      }
    : undefined;

  return useQuery({
    queryKey: QK.accountingReporting.accountLedger(normalized ?? {}),
    enabled:
      status === "authenticated" &&
      hasAccessToken &&
      !hasSessionError &&
      Boolean(normalized?.accountId) &&
      (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingReportingAccountLedgerResponse> => {
      if (!normalized?.accountId) {
        throw new Error("accountId is required");
      }
      return ensureAccountingReportingSuccess(await getAccountingReportingAccountLedger(normalized));
    },
    retry: false,
  });
}
