/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccountingJournalEntry,
  createAccountingJournalPeriodLock,
  ensureAccountingJournalSuccess,
  getAccountingJournalCurrentPeriodLock,
  getAccountingJournalEntryDetail,
  getAccountingJournalEntryPdfMetadata,
  getAccountingJournalOverview,
  listAccountingJournalAuditLogs,
  listAccountingJournalEntries,
  listAccountingJournalEntryAuditLogs,
  postAccountingJournalEntry,
  reverseAccountingJournalEntry,
  updateAccountingJournalEntry,
} from "@/services/api/accounting-journal";
import type {
  AccountingJournalAuditLogsQuery,
  AccountingJournalAuditLogsResponse,
  AccountingJournalCreateEntryRequest,
  AccountingJournalCreateEntryResponse,
  AccountingJournalCreatePeriodLockRequest,
  AccountingJournalCreatePeriodLockResponse,
  AccountingJournalCurrentPeriodLockQuery,
  AccountingJournalCurrentPeriodLockResponse,
  AccountingJournalDetailResponse,
  AccountingJournalEntriesQuery,
  AccountingJournalEntriesResponse,
  AccountingJournalEntryAuditLogsQuery,
  AccountingJournalEntryAuditLogsResponse,
  AccountingJournalPdfMetadataResponse,
  AccountingJournalPostEntryRequest,
  AccountingJournalPostEntryResponse,
  AccountingJournalReverseEntryRequest,
  AccountingJournalReverseEntryResponse,
  AccountingJournalOverviewResponse,
  AccountingJournalUpdateEntryRequest,
  AccountingJournalUpdateEntryResponse,
} from "@/types/api/accounting-journal";

import { QK } from "./queryKeys";

export function useAccountingJournalOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.accountingJournal.overview(),
    queryFn: async (): Promise<AccountingJournalOverviewResponse> =>
      ensureAccountingJournalSuccess(await getAccountingJournalOverview()),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingJournalEntries(
  params?: AccountingJournalEntriesQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingJournalEntriesQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingJournal.entries(normalized),
    queryFn: async (): Promise<AccountingJournalEntriesResponse> =>
      ensureAccountingJournalSuccess(await listAccountingJournalEntries(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingJournalEntryDetail(
  journalNumber?: string,
  options?: { enabled?: boolean }
) {
  const normalizedJournalNumber = (journalNumber ?? "").trim();

  return useQuery({
    queryKey: QK.accountingJournal.entryDetail(normalizedJournalNumber),
    enabled: Boolean(normalizedJournalNumber) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingJournalDetailResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalEntryDetail(normalizedJournalNumber)
      ),
  });
}

export function useAccountingJournalEntryAuditLogs(
  journalNumber?: string,
  params?: AccountingJournalEntryAuditLogsQuery,
  options?: { enabled?: boolean }
) {
  const normalizedJournalNumber = (journalNumber ?? "").trim();
  const normalizedParams: AccountingJournalEntryAuditLogsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 10,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingJournal.entryAuditLogs(
      normalizedJournalNumber,
      normalizedParams
    ),
    enabled: Boolean(normalizedJournalNumber) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingJournalEntryAuditLogsResponse> =>
      ensureAccountingJournalSuccess(
        await listAccountingJournalEntryAuditLogs(
          normalizedJournalNumber,
          normalizedParams
        )
      ),
  });
}

export function useAccountingJournalAuditLogs(
  params?: AccountingJournalAuditLogsQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingJournalAuditLogsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingJournal.auditLogs(normalized),
    queryFn: async (): Promise<AccountingJournalAuditLogsResponse> =>
      ensureAccountingJournalSuccess(await listAccountingJournalAuditLogs(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingJournalCurrentPeriodLock(
  params?: AccountingJournalCurrentPeriodLockQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingJournalCurrentPeriodLockQuery = {
    year: params?.year,
    month: params?.month,
  };

  return useQuery({
    queryKey: QK.accountingJournal.periodLockCurrent(normalized),
    queryFn: async (): Promise<AccountingJournalCurrentPeriodLockResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalCurrentPeriodLock(normalized)
      ),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingJournalMutations() {
  const qc = useQueryClient();

  const createEntry = useMutation({
    mutationFn: async (vars: {
      payload: AccountingJournalCreateEntryRequest;
      idempotencyKey?: string;
    }): Promise<AccountingJournalCreateEntryResponse> =>
      ensureAccountingJournalSuccess(
        await createAccountingJournalEntry(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounting-journal", "entries"] });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.overview() });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.auditLogs() });
    },
  });

  const updateEntry = useMutation({
    mutationFn: async (vars: {
      journalNumber: string;
      payload: AccountingJournalUpdateEntryRequest;
    }): Promise<AccountingJournalUpdateEntryResponse> =>
      ensureAccountingJournalSuccess(
        await updateAccountingJournalEntry(vars.journalNumber, vars.payload)
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-journal", "entries"] });
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.entryDetail(vars.journalNumber),
      });
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.entryAuditLogs(vars.journalNumber),
      });
    },
  });

  const postEntry = useMutation({
    mutationFn: async (vars: {
      journalNumber: string;
      payload?: AccountingJournalPostEntryRequest;
      idempotencyKey?: string;
    }): Promise<AccountingJournalPostEntryResponse> =>
      ensureAccountingJournalSuccess(
        await postAccountingJournalEntry(vars.journalNumber, vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-journal", "entries"] });
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.entryDetail(vars.journalNumber),
      });
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.entryAuditLogs(vars.journalNumber),
      });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.auditLogs() });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.overview() });
    },
  });

  const reverseEntry = useMutation({
    mutationFn: async (vars: {
      journalNumber: string;
      payload?: AccountingJournalReverseEntryRequest;
      idempotencyKey?: string;
    }): Promise<AccountingJournalReverseEntryResponse> =>
      ensureAccountingJournalSuccess(
        await reverseAccountingJournalEntry(vars.journalNumber, vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-journal", "entries"] });
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.entryDetail(vars.journalNumber),
      });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.auditLogs() });
    },
  });

  const exportEntryPdf = useMutation({
    mutationFn: async (journalNumber: string): Promise<AccountingJournalPdfMetadataResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalEntryPdfMetadata(journalNumber)
      ),
  });

  const createPeriodLock = useMutation({
    mutationFn: async (vars: {
      payload: AccountingJournalCreatePeriodLockRequest;
      idempotencyKey?: string;
    }): Promise<AccountingJournalCreatePeriodLockResponse> =>
      ensureAccountingJournalSuccess(
        await createAccountingJournalPeriodLock(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: QK.accountingJournal.periodLockCurrent(),
      });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.overview() });
      qc.invalidateQueries({ queryKey: ["accounting-journal", "entries"] });
      qc.invalidateQueries({ queryKey: QK.accountingJournal.auditLogs() });
    },
  });

  return {
    createEntry,
    updateEntry,
    postEntry,
    reverseEntry,
    exportEntryPdf,
    createPeriodLock,
  } as const;
}
