/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  confirmAccountingApOcrSession,
  createAccountingApBatchPayment,
  createAccountingApBill,
  createAccountingApOcrSession,
  ensureAccountingApSuccess,
  getAccountingApBatchPaymentDetail,
  getAccountingApBillDetail,
  listAccountingApBillPayments,
  listAccountingApBills,
  listAccountingApOverview,
  listAccountingApVendorCredits,
  previewAccountingApBatchPayment,
  updateAccountingApBill,
  updateAccountingApBillStatus,
  updateAccountingApOcrSession,
} from "@/services/api/accounting-ap";
import type {
  AccountingApBatchDetailResponse,
  AccountingApBatchPreviewRequest,
  AccountingApBatchPreviewResponse,
  AccountingApBillDetailResponse,
  AccountingApBillListQuery,
  AccountingApBillListResponse,
  AccountingApBillPaymentHistoryResponse,
  AccountingApConfirmOcrSessionRequest,
  AccountingApConfirmOcrSessionResponse,
  AccountingApCreateBatchPaymentRequest,
  AccountingApCreateBatchPaymentResponse,
  AccountingApCreateBillRequest,
  AccountingApCreateBillResponse,
  AccountingApCreateOcrSessionRequest,
  AccountingApCreateOcrSessionResponse,
  AccountingApOverviewResponse,
  AccountingApUpdateBillRequest,
  AccountingApUpdateBillStatusRequest,
  AccountingApUpdateBillStatusResponse,
  AccountingApUpdateOcrSessionRequest,
  AccountingApUpdateOcrSessionResponse,
  AccountingApVendorCreditListQuery,
  AccountingApVendorCreditListResponse,
} from "@/types/api/accounting-ap";

import { QK } from "./queryKeys";

export function useAccountingApOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.accountingAp.overview(),
    queryFn: async (): Promise<AccountingApOverviewResponse> =>
      ensureAccountingApSuccess(await listAccountingApOverview()),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingApBills(
  params?: AccountingApBillListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingApBillListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingAp.bills(normalized),
    queryFn: async (): Promise<AccountingApBillListResponse> =>
      ensureAccountingApSuccess(await listAccountingApBills(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingApBillDetail(
  billNumber?: string,
  options?: { enabled?: boolean }
) {
  const normalizedBillNumber = (billNumber ?? "").trim();

  return useQuery({
    queryKey: QK.accountingAp.billDetail(normalizedBillNumber),
    enabled: Boolean(normalizedBillNumber) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingApBillDetailResponse> =>
      ensureAccountingApSuccess(await getAccountingApBillDetail(normalizedBillNumber)),
  });
}

export function useAccountingApBillPayments(
  billNumber?: string,
  options?: { enabled?: boolean }
) {
  const normalizedBillNumber = (billNumber ?? "").trim();

  return useQuery({
    queryKey: QK.accountingAp.billPayments(normalizedBillNumber),
    enabled: Boolean(normalizedBillNumber) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingApBillPaymentHistoryResponse> =>
      ensureAccountingApSuccess(await listAccountingApBillPayments(normalizedBillNumber)),
  });
}

export function useAccountingApVendorCredits(
  params?: AccountingApVendorCreditListQuery,
  options?: { enabled?: boolean }
) {
  const normalized: AccountingApVendorCreditListQuery = {
    page: params?.page ?? 1,
    per_page: params?.per_page ?? 20,
    ...params,
  };

  return useQuery({
    queryKey: QK.accountingAp.vendorCredits(normalized),
    queryFn: async (): Promise<AccountingApVendorCreditListResponse> =>
      ensureAccountingApSuccess(await listAccountingApVendorCredits(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useAccountingApBatchDetail(
  batchReference?: string,
  options?: { enabled?: boolean }
) {
  const normalizedBatchReference = (batchReference ?? "").trim();

  return useQuery({
    queryKey: QK.accountingAp.batchDetail(normalizedBatchReference),
    enabled: Boolean(normalizedBatchReference) && (options?.enabled ?? true),
    queryFn: async (): Promise<AccountingApBatchDetailResponse> =>
      ensureAccountingApSuccess(
        await getAccountingApBatchPaymentDetail(normalizedBatchReference)
      ),
  });
}

export function useAccountingApBillMutations() {
  const qc = useQueryClient();

  const createBill = useMutation({
    mutationFn: async (vars: {
      payload: AccountingApCreateBillRequest;
      idempotencyKey?: string;
    }): Promise<AccountingApCreateBillResponse> =>
      ensureAccountingApSuccess(
        await createAccountingApBill(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounting-ap", "bills"] });
      qc.invalidateQueries({ queryKey: QK.accountingAp.overview() });
    },
  });

  const updateBill = useMutation({
    mutationFn: async (vars: {
      billNumber: string;
      payload: AccountingApUpdateBillRequest;
    }): Promise<AccountingApCreateBillResponse> =>
      ensureAccountingApSuccess(await updateAccountingApBill(vars.billNumber, vars.payload)),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-ap", "bills"] });
      qc.invalidateQueries({ queryKey: QK.accountingAp.billDetail(vars.billNumber) });
    },
  });

  const updateBillStatus = useMutation({
    mutationFn: async (vars: {
      billNumber: string;
      payload: AccountingApUpdateBillStatusRequest;
    }): Promise<AccountingApUpdateBillStatusResponse> =>
      ensureAccountingApSuccess(
        await updateAccountingApBillStatus(vars.billNumber, vars.payload)
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-ap", "bills"] });
      qc.invalidateQueries({ queryKey: QK.accountingAp.billDetail(vars.billNumber) });
      qc.invalidateQueries({ queryKey: QK.accountingAp.overview() });
    },
  });

  return {
    createBill,
    updateBill,
    updateBillStatus,
  } as const;
}

export function useAccountingApBatchMutations() {
  const qc = useQueryClient();

  const previewBatchPayment = useMutation({
    mutationFn: async (
      payload: AccountingApBatchPreviewRequest
    ): Promise<AccountingApBatchPreviewResponse> =>
      ensureAccountingApSuccess(await previewAccountingApBatchPayment(payload)),
  });

  const confirmBatchPayment = useMutation({
    mutationFn: async (vars: {
      payload: AccountingApCreateBatchPaymentRequest;
      idempotencyKey?: string;
    }): Promise<AccountingApCreateBatchPaymentResponse> =>
      ensureAccountingApSuccess(
        await createAccountingApBatchPayment(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["accounting-ap", "bills"] });
      qc.invalidateQueries({ queryKey: QK.accountingAp.overview() });
      qc.invalidateQueries({ queryKey: QK.accountingAp.batchDetail(vars.payload.batch_reference) });
    },
  });

  return {
    previewBatchPayment,
    confirmBatchPayment,
  } as const;
}

export function useAccountingApOcrMutations() {
  const qc = useQueryClient();

  const createOcrSession = useMutation({
    mutationFn: async (vars: {
      payload: AccountingApCreateOcrSessionRequest;
      idempotencyKey?: string;
    }): Promise<AccountingApCreateOcrSessionResponse> =>
      ensureAccountingApSuccess(
        await createAccountingApOcrSession(vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
  });

  const saveOcrProgress = useMutation({
    mutationFn: async (vars: {
      sessionId: string;
      payload: AccountingApUpdateOcrSessionRequest;
    }): Promise<AccountingApUpdateOcrSessionResponse> =>
      ensureAccountingApSuccess(
        await updateAccountingApOcrSession(vars.sessionId, vars.payload)
      ),
  });

  const confirmOcrSession = useMutation({
    mutationFn: async (vars: {
      sessionId: string;
      payload?: AccountingApConfirmOcrSessionRequest;
      idempotencyKey?: string;
    }): Promise<AccountingApConfirmOcrSessionResponse> =>
      ensureAccountingApSuccess(
        await confirmAccountingApOcrSession(vars.sessionId, vars.payload, {
          idempotencyKey: vars.idempotencyKey,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounting-ap", "bills"] });
      qc.invalidateQueries({ queryKey: QK.accountingAp.overview() });
    },
  });

  return {
    createOcrSession,
    saveOcrProgress,
    confirmOcrSession,
  } as const;
}
