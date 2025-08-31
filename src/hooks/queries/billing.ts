/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Invoice, Payment, Plan } from "@/types/api";
import {
  listVendorPlans,
  createVendorPlan,
  getVendorPlan,
  updateVendorPlan,
  deleteVendorPlan,
  listVendorInvoices,
  createVendorInvoice,
  updateVendorInvoice,
  deleteVendorInvoice,
  listClientInvoices,
  createPayment,
  verifyVendorPayment,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type { StatusAudit, Subscription, SubscriptionSummary } from "@/types/api";
import { getClientInvoice, getClientSubscription, listClientInvoiceAudits, getVendorSubscriptionsSummary, listVendorAudits } from "@/services/api";

export function useVendorPlans(
  params: { limit: number; cursor?: string },
  initialData?: Plan[] | undefined
) {
  return useQuery({
    queryKey: QK.billing.vendor.plans(params),
    queryFn: async () => ensureSuccess(await listVendorPlans(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorPlan(
  id?: string | number,
  initialData?: Plan | undefined
) {
  return useQuery({
    queryKey: QK.billing.vendor.plan(id ?? ""),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await getVendorPlan(id as string | number)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorInvoices(initialData?: Invoice[] | undefined) {
  return useQuery({
    queryKey: QK.billing.vendor.invoices(),
    queryFn: async () => ensureSuccess(await listVendorInvoices()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useClientInvoices(initialData?: Invoice[] | undefined) {
  return useQuery({
    queryKey: QK.billing.client.invoices(),
    queryFn: async () => ensureSuccess(await listClientInvoices()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useClientInvoice(
  id?: string | number,
  initialData?: Invoice | undefined
) {
  return useQuery({
    queryKey: QK.billing.client.invoice(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getClientInvoice(id as string | number)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useClientInvoiceAudits(
  id?: string | number,
  params?: { limit?: number; cursor?: string },
  initialData?: StatusAudit[] | undefined
) {
  return useQuery({
    queryKey: QK.billing.client.invoiceAudits(id ?? "", params),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await listClientInvoiceAudits(id as string | number, params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useClientSubscription(initialData?: Subscription | undefined) {
  return useQuery({
    queryKey: QK.billing.client.subscription(),
    queryFn: async () => ensureSuccess(await getClientSubscription()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorSubscriptionsSummary(
  initialData?: SubscriptionSummary | undefined
) {
  return useQuery({
    queryKey: QK.billing.vendor.subscriptions.summary(),
    queryFn: async () => ensureSuccess(await getVendorSubscriptionsSummary()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorAudits(
  params?: { limit?: number; cursor?: string },
  initialData?: StatusAudit[] | undefined
) {
  const final = { limit: params?.limit ?? 50, cursor: params?.cursor };
  return useQuery({
    queryKey: QK.billing.vendor.audits(final),
    queryFn: async () => ensureSuccess(await listVendorAudits(final)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useBillingActions() {
  const qc = useQueryClient();

  const createPlan = useMutation({
    mutationFn: async (payload: Partial<Plan>) =>
      ensureSuccess(await createVendorPlan(payload)),
    onSuccess: () => {
      // Invalidate any vendor plans lists
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "billing" &&
          q.queryKey[1] === "vendor" &&
          q.queryKey[2] === "plans",
      });
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (vars: { id: string | number; payload: Partial<Plan> }) =>
      ensureSuccess(await updateVendorPlan(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.plan(vars.id) });
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "billing" &&
          q.queryKey[1] === "vendor" &&
          q.queryKey[2] === "plans",
      });
    },
  });

  const deletePlan = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteVendorPlan(id)),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "billing" &&
          q.queryKey[1] === "vendor" &&
          q.queryKey[2] === "plans",
      });
    },
  });

  const createVendorInv = useMutation({
    mutationFn: async (payload: Partial<Invoice>) =>
      ensureSuccess(await createVendorInvoice(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
    },
  });

  const updateVendorInv = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: Partial<Invoice>;
    }) => ensureSuccess(await updateVendorInvoice(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoice(vars.id) });
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
    },
  });

  const deleteVendorInv = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteVendorInvoice(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
    },
  });

  const createClientPayment = useMutation({
    mutationFn: async (vars: {
      invoiceId: string | number;
      payload: Partial<Payment>;
    }) => ensureSuccess(await createPayment(vars.invoiceId, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.client.invoices() });
    },
  });

  const verifyVendorPay = useMutation({
    mutationFn: async (vars: { id: string | number; payload?: any }) =>
      ensureSuccess(await verifyVendorPayment(vars.id, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
    },
  });

  return {
    createPlan,
    updatePlan,
    deletePlan,
    createVendorInv,
    updateVendorInv,
    deleteVendorInv,
    createClientPayment,
    verifyVendorPay,
  } as const;
}
