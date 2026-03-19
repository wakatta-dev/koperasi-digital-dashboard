/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  createAccountingJournalEntry,
  createAccountingJournalPeriodLock,
  ensureAccountingJournalSuccess,
  getAccountingJournalSourceTrace,
  getAccountingJournalCurrentPeriodLock,
  getAccountingJournalEntryDetail,
  getAccountingJournalEntryPdfMetadata,
  getAccountingJournalOverview,
  listAccountingJournalPostingPolicies,
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
  AccountingJournalPostingPoliciesQuery,
  AccountingJournalPostingPoliciesResponse,
  AccountingJournalSourceTraceResponse,
  AccountingJournalUpdateEntryRequest,
  AccountingJournalUpdateEntryResponse,
} from "@/types/api/accounting-journal";

import { QK } from "./queryKeys";

function useAccountingQueryEnabled(explicitEnabled = true) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);

  return status === "authenticated" && hasAccessToken && !hasSessionError && explicitEnabled;
}

export function useAccountingJournalOverview(options?: { enabled?: boolean }) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  return useQuery({
    queryKey: QK.accountingJournal.overview(),
    enabled,
    queryFn: async (): Promise<AccountingJournalOverviewResponse> =>
      ensureAccountingJournalSuccess(await getAccountingJournalOverview()),
    retry: false,
  });
}

export function useAccountingJournalPostingPolicies(
  params?: AccountingJournalPostingPoliciesQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingJournalPostingPoliciesQuery = {
    domain: params?.domain,
    status: params?.status,
  };

  return useQuery({
    queryKey: QK.accountingJournal.postingPolicies(normalized),
    enabled,
    queryFn: async (): Promise<AccountingJournalPostingPoliciesResponse> =>
      ensureAccountingJournalSuccess(await listAccountingJournalPostingPolicies(normalized)),
    retry: false,
  });
}

export function useAccountingJournalSourceTrace(
  domain?: string,
  sourceId?: string | number,
  options?: { enabled?: boolean }
) {
  const normalizedDomain = (domain ?? "").trim();
  const normalizedSourceId = String(sourceId ?? "").trim();
  const enabled = useAccountingQueryEnabled(
    Boolean(normalizedDomain) &&
      Boolean(normalizedSourceId) &&
      (options?.enabled ?? true)
  );

  return useQuery({
    queryKey: QK.accountingJournal.sourceTrace(normalizedDomain, normalizedSourceId),
    enabled,
    queryFn: async (): Promise<AccountingJournalSourceTraceResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalSourceTrace(normalizedDomain, normalizedSourceId)
      ),
    retry: false,
  });
}

export function useAccountingJournalEntries(
  params?: AccountingJournalEntriesQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingJournalEntriesQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingJournal.entries(normalized),
    enabled,
    queryFn: async (): Promise<AccountingJournalEntriesResponse> =>
      ensureAccountingJournalSuccess(await listAccountingJournalEntries(normalized)),
    retry: false,
  });
}

export function useAccountingJournalEntryDetail(
  journalNumber?: string,
  options?: { enabled?: boolean }
) {
  const normalizedJournalNumber = (journalNumber ?? "").trim();
  const enabled = useAccountingQueryEnabled(
    Boolean(normalizedJournalNumber) && (options?.enabled ?? true)
  );

  return useQuery({
    queryKey: QK.accountingJournal.entryDetail(normalizedJournalNumber),
    enabled,
    queryFn: async (): Promise<AccountingJournalDetailResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalEntryDetail(normalizedJournalNumber)
      ),
    retry: false,
  });
}

export function useAccountingJournalEntryAuditLogs(
  journalNumber?: string,
  params?: AccountingJournalEntryAuditLogsQuery,
  options?: { enabled?: boolean }
) {
  const normalizedJournalNumber = (journalNumber ?? "").trim();
  const enabled = useAccountingQueryEnabled(
    Boolean(normalizedJournalNumber) && (options?.enabled ?? true)
  );
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
    enabled,
    queryFn: async (): Promise<AccountingJournalEntryAuditLogsResponse> =>
      ensureAccountingJournalSuccess(
        await listAccountingJournalEntryAuditLogs(
          normalizedJournalNumber,
          normalizedParams
        )
      ),
    retry: false,
  });
}

export function useAccountingJournalAuditLogs(
  params?: AccountingJournalAuditLogsQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingJournalAuditLogsQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingJournal.auditLogs(normalized),
    enabled,
    queryFn: async (): Promise<AccountingJournalAuditLogsResponse> =>
      ensureAccountingJournalSuccess(await listAccountingJournalAuditLogs(normalized)),
    retry: false,
  });
}

export function useAccountingJournalCurrentPeriodLock(
  params?: AccountingJournalCurrentPeriodLockQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingJournalCurrentPeriodLockQuery = {
    year: params?.year,
    month: params?.month,
  };

  return useQuery({
    queryKey: QK.accountingJournal.periodLockCurrent(normalized),
    enabled,
    queryFn: async (): Promise<AccountingJournalCurrentPeriodLockResponse> =>
      ensureAccountingJournalSuccess(
        await getAccountingJournalCurrentPeriodLock(normalized)
      ),
    retry: false,
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
