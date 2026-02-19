/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

export function useAccountingTaxOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.accountingTax.overview(),
    queryFn: async (): Promise<AccountingTaxOverviewResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxOverview()),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxPeriods(
  params?: AccountingTaxPeriodsQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingTaxPeriodsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.periods(normalized),
    queryFn: async (): Promise<AccountingTaxPeriodsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxPeriods(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxVatTransactions(
  params?: AccountingTaxVatTransactionsQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingTaxVatTransactionsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.vatTransactions(normalized),
    queryFn: async (): Promise<AccountingTaxVatTransactionsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxVatTransactions(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxPphRecords(
  params?: AccountingTaxPphRecordsQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingTaxPphRecordsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.pphRecords(normalized),
    queryFn: async (): Promise<AccountingTaxPphRecordsResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxPphRecords(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxExportHistory(
  params?: AccountingTaxExportHistoryQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingTaxExportHistoryQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.exportHistory(normalized),
    queryFn: async (): Promise<AccountingTaxExportHistoryResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxExportHistory(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxEfakturReady(
  params?: AccountingTaxEfakturReadyQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingTaxEfakturReadyQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingTax.efakturReady(normalized),
    queryFn: async (): Promise<AccountingTaxEfakturReadyResponse> =>
      ensureAccountingTaxSuccess(await listAccountingTaxEfakturReady(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxIncomeTaxReport(
  params?: AccountingTaxIncomeTaxReportQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.accountingTax.incomeTaxReport(params ?? {}),
    queryFn: async (): Promise<AccountingTaxIncomeTaxReportResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxIncomeTaxReport(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxCompliance(
  params?: AccountingTaxComplianceQuery,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.accountingTax.compliance(params ?? {}),
    queryFn: async (): Promise<AccountingTaxComplianceResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxCompliance(params)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingTaxFileDownload(
  fileId?: string,
  options?: { enabled?: boolean }
) {
  const normalizedFileId = (fileId ?? "").trim();

  return useQuery({
    queryKey: QK.accountingTax.fileDownload(normalizedFileId),
    enabled: Boolean(normalizedFileId) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingTaxDownloadFileResponse> =>
      ensureAccountingTaxSuccess(await getAccountingTaxFileDownload(normalizedFileId)),
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
