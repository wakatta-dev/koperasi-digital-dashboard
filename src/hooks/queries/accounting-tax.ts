/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  ensureAccountingTaxSuccess,
  exportAccountingTaxEfaktur,
  exportAccountingTaxPphReport,
  exportAccountingTaxPpnRecap,
  generateAccountingTaxReport,
  getAccountingTaxCompliance,
  getAccountingTaxFileDownload,
  getAccountingTaxIncomeTaxReport,
  getAccountingTaxOverview,
  listAccountingTaxEfakturReady,
  listAccountingTaxExportHistory,
  listAccountingTaxPeriods,
  listAccountingTaxPphRecords,
  listAccountingTaxVatTransactions,
  retryAccountingTaxExportHistory,
} from "@/services/api/accounting-tax";
import type {
  AccountingTaxComplianceQuery,
  AccountingTaxComplianceResponse,
  AccountingTaxDownloadFileResponse,
  AccountingTaxEfakturExportRequest,
  AccountingTaxEfakturExportResponse,
  AccountingTaxEfakturReadyQuery,
  AccountingTaxEfakturReadyResponse,
  AccountingTaxExportHistoryQuery,
  AccountingTaxExportHistoryResponse,
  AccountingTaxExportPphReportRequest,
  AccountingTaxExportPphReportResponse,
  AccountingTaxExportPpnRecapRequest,
  AccountingTaxExportPpnRecapResponse,
  AccountingTaxGenerateReportRequest,
  AccountingTaxGenerateReportResponse,
  AccountingTaxIncomeTaxReportQuery,
  AccountingTaxIncomeTaxReportResponse,
  AccountingTaxOverviewResponse,
  AccountingTaxPeriodsQuery,
  AccountingTaxPeriodsResponse,
  AccountingTaxPphRecordsQuery,
  AccountingTaxPphRecordsResponse,
  AccountingTaxRetryExportResponse,
  AccountingTaxVatTransactionsQuery,
  AccountingTaxVatTransactionsResponse,
} from "@/types/api/accounting-tax";

import { QK } from "./queryKeys";

function useAccountingQueryEnabled(explicitEnabled = true) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);

  return status === "authenticated" && hasAccessToken && !hasSessionError && explicitEnabled;
}

export function useAccountingTaxOverview(options?: { enabled?: boolean }) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  return useQuery({
    queryKey: QK.accountingTax.overview(),
    enabled,
    queryFn: async (): Promise<AccountingTaxOverviewResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxOverview()),
    retry: false,
  });
}

export function useAccountingTaxPeriods(
  params?: AccountingTaxPeriodsQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingTaxPeriodsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.periods(normalized),
    enabled,
    queryFn: async (): Promise<AccountingTaxPeriodsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxPeriods(normalized)),
    retry: false,
  });
}

export function useAccountingTaxVatTransactions(
  params?: AccountingTaxVatTransactionsQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingTaxVatTransactionsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.vatTransactions(normalized),
    enabled,
    queryFn: async (): Promise<AccountingTaxVatTransactionsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxVatTransactions(normalized)),
    retry: false,
  });
}

export function useAccountingTaxPphRecords(
  params?: AccountingTaxPphRecordsQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingTaxPphRecordsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.pphRecords(normalized),
    enabled,
    queryFn: async (): Promise<AccountingTaxPphRecordsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxPphRecords(normalized)),
    retry: false,
  });
}

export function useAccountingTaxExportHistory(
  params?: AccountingTaxExportHistoryQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingTaxExportHistoryQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.exportHistory(normalized),
    enabled,
    queryFn: async (): Promise<AccountingTaxExportHistoryResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxExportHistory(normalized)),
    retry: false,
  });
}

export function useAccountingTaxEfakturReady(
  params?: AccountingTaxEfakturReadyQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingTaxEfakturReadyQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.efakturReady(normalized),
    enabled,
    queryFn: async (): Promise<AccountingTaxEfakturReadyResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxEfakturReady(normalized)),
    retry: false,
  });
}

export function useAccountingTaxIncomeTaxReport(
  params?: AccountingTaxIncomeTaxReportQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  return useQuery({
    queryKey: QK.accountingTax.incomeTaxReport(params ?? {}),
    enabled,
    queryFn: async (): Promise<AccountingTaxIncomeTaxReportResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxIncomeTaxReport(params)),
    retry: false,
  });
}

export function useAccountingTaxCompliance(
  params?: AccountingTaxComplianceQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  return useQuery({
    queryKey: QK.accountingTax.compliance(params ?? {}),
    enabled,
    queryFn: async (): Promise<AccountingTaxComplianceResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxCompliance(params)),
    retry: false,
  });
}

export function useAccountingTaxFileDownload(
  fileId?: string,
  options?: { enabled?: boolean }
) {
  const normalizedFileId = (fileId ?? "").trim();
  const enabled = useAccountingQueryEnabled(
    Boolean(normalizedFileId) && (options?.enabled ?? true)
  );

  return useQuery({
    queryKey: QK.accountingTax.fileDownload(normalizedFileId),
    enabled,
    queryFn: async (): Promise<AccountingTaxDownloadFileResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxFileDownload(normalizedFileId)),
    retry: false,
  });
}

export function useAccountingTaxMutations() {
  const qc = useQueryClient();

  const generateTaxReport = useMutation({
    mutationFn: async (vars: {
      payload: AccountingTaxGenerateReportRequest;
      idempotencyKey?: string;
    }): Promise<AccountingTaxGenerateReportResponse> =>
      ensureAccountingTaxSuccess(
        await generateAccountingTaxReport(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingTax.exportHistory() });
      qc.invalidateQueries({ queryKey: QK.accountingTax.overview() });
    },
  });

  const retryExportHistory = useMutation({
    mutationFn: async (vars: {
      exportId: string;
      idempotencyKey?: string;
    }): Promise<AccountingTaxRetryExportResponse> =>
      ensureAccountingTaxSuccess(
        await retryAccountingTaxExportHistory(vars.exportId, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingTax.exportHistory() });
    },
  });

  const exportPphReport = useMutation({
    mutationFn: async (vars: {
      payload: AccountingTaxExportPphReportRequest;
      idempotencyKey?: string;
    }): Promise<AccountingTaxExportPphReportResponse> =>
      ensureAccountingTaxSuccess(
        await exportAccountingTaxPphReport(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingTax.pphRecords() });
      qc.invalidateQueries({ queryKey: QK.accountingTax.exportHistory() });
    },
  });

  const exportPpnRecapitulation = useMutation({
    mutationFn: async (vars: {
      payload: AccountingTaxExportPpnRecapRequest;
      idempotencyKey?: string;
    }): Promise<AccountingTaxExportPpnRecapResponse> =>
      ensureAccountingTaxSuccess(
        await exportAccountingTaxPpnRecap(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingTax.vatTransactions() });
      qc.invalidateQueries({ queryKey: QK.accountingTax.exportHistory() });
    },
  });

  const exportEfaktur = useMutation({
    mutationFn: async (vars: {
      payload: AccountingTaxEfakturExportRequest;
      idempotencyKey?: string;
    }): Promise<AccountingTaxEfakturExportResponse> =>
      ensureAccountingTaxSuccess(
        await exportAccountingTaxEfaktur(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingTax.efakturReady() });
      qc.invalidateQueries({ queryKey: QK.accountingTax.exportHistory() });
      qc.invalidateQueries({ queryKey: QK.accountingTax.compliance() });
    },
  });

  return {
    generateTaxReport,
    retryExportHistory,
    exportPphReport,
    exportPpnRecapitulation,
    exportEfaktur,
  } as const;
}
