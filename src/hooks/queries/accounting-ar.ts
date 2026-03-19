/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import {
  createAccountingArCreditNote,
  createAccountingArInvoice,
  createAccountingArPayment,
  ensureAccountingArSuccess,
  getAccountingArInvoiceDetail,
  listAccountingArCreditNotes,
  listAccountingArInvoices,
  listAccountingArPayments,
  sendAccountingArInvoice,
} from "@/services/api/accounting-ar";
import type {
  AccountingArCreateCreditNoteRequest,
  AccountingArCreateCreditNoteResponse,
  AccountingArCreateInvoiceRequest,
  AccountingArCreateInvoiceResponse,
  AccountingArCreditNoteListQuery,
  AccountingArCreditNoteListResponse,
  AccountingArInvoiceDetailResponse,
  AccountingArInvoiceListQuery,
  AccountingArInvoiceListResponse,
  AccountingArPaymentListQuery,
  AccountingArPaymentListResponse,
  AccountingArRecordPaymentRequest,
  AccountingArRecordPaymentResponse,
  AccountingArSendInvoiceRequest,
  AccountingArSendInvoiceResponse,
} from "@/types/api/accounting-ar";

import { QK } from "./queryKeys";

function useAccountingQueryEnabled(explicitEnabled = true) {
  const { data: session, status } = useSession();
  const hasAccessToken = Boolean((session as { accessToken?: string } | null)?.accessToken);
  const hasSessionError = Boolean((session as { error?: string } | null)?.error);

  return status === "authenticated" && hasAccessToken && !hasSessionError && explicitEnabled;
}

export function useAccountingArInvoices(
  params?: AccountingArInvoiceListQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingArInvoiceListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingAr.invoices(normalized),
    enabled,
    queryFn: async (): Promise<AccountingArInvoiceListResponse> =>
      ensureAccountingArSuccess(await listAccountingArInvoices(normalized)),
    retry: false,
  });
}

export function useAccountingArInvoiceDetail(
  invoiceNumber?: string,
  options?: { enabled?: boolean }
) {
  const normalizedInvoiceNumber = (invoiceNumber ?? "").trim();
  const enabled = useAccountingQueryEnabled(
    Boolean(normalizedInvoiceNumber) && (options?.enabled ?? true)
  );

  return useQuery({
    queryKey: QK.accountingAr.invoiceDetail(normalizedInvoiceNumber),
    enabled,
    queryFn: async (): Promise<AccountingArInvoiceDetailResponse> =>
      ensureAccountingArSuccess(await getAccountingArInvoiceDetail(normalizedInvoiceNumber)),
    retry: false,
  });
}

export function useAccountingArCreditNotes(
  params?: AccountingArCreditNoteListQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingArCreditNoteListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingAr.creditNotes(normalized),
    enabled,
    queryFn: async (): Promise<AccountingArCreditNoteListResponse> =>
      ensureAccountingArSuccess(await listAccountingArCreditNotes(normalized)),
    retry: false,
  });
}

export function useAccountingArPayments(
  params?: AccountingArPaymentListQuery,
  options?: { enabled?: boolean }
) {
  const enabled = useAccountingQueryEnabled(options?.enabled ?? true);
  const normalized: AccountingArPaymentListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingAr.payments(normalized),
    enabled,
    queryFn: async (): Promise<AccountingArPaymentListResponse> =>
      ensureAccountingArSuccess(await listAccountingArPayments(normalized)),
    retry: false,
  });
}

export function useAccountingArInvoiceMutations() {
  const qc = useQueryClient();

  const createInvoice = useMutation({
    mutationFn: async (vars: {
      payload: AccountingArCreateInvoiceRequest;
      idempotencyKey?: string;
    }): Promise<AccountingArCreateInvoiceResponse> =>
      ensureAccountingArSuccess(
        await createAccountingArInvoice(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingAr.invoices() });
    },
  });

  const sendInvoice = useMutation({
    mutationFn: async (vars: {
      invoiceNumber: string;
      payload: AccountingArSendInvoiceRequest;
    }): Promise<AccountingArSendInvoiceResponse> =>
      ensureAccountingArSuccess(await sendAccountingArInvoice(vars.invoiceNumber, vars.payload)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: QK.accountingAr.invoices() });
      qc.invalidateQueries({ queryKey: QK.accountingAr.invoiceDetail(vars.invoiceNumber) });
    },
  });

  return {
    createInvoice,
    sendInvoice,
  } as const;
}

export function useAccountingArCreditNoteMutations() {
  const qc = useQueryClient();

  const createCreditNote = useMutation({
    mutationFn: async (vars: {
      payload: AccountingArCreateCreditNoteRequest;
      idempotencyKey?: string;
    }): Promise<AccountingArCreateCreditNoteResponse> =>
      ensureAccountingArSuccess(
        await createAccountingArCreditNote(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingAr.creditNotes() });
    },
  });

  return {
    createCreditNote,
  } as const;
}

export function useAccountingArPaymentMutations() {
  const qc = useQueryClient();

  const createPayment = useMutation({
    mutationFn: async (vars: {
      payload: AccountingArRecordPaymentRequest;
      idempotencyKey?: string;
    }): Promise<AccountingArRecordPaymentResponse> =>
      ensureAccountingArSuccess(
        await createAccountingArPayment(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.accountingAr.payments() });
      qc.invalidateQueries({ queryKey: QK.accountingAr.invoices() });
    },
  });

  return {
    createPayment,
  } as const;
}
