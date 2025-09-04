/** @format */

"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Invoice, Payment, Plan } from "@/types/api";
import {
  listVendorPlans,
  createVendorPlan,
  getVendorPlan,
  updateVendorPlan,
  updateVendorPlanStatus,
  deleteVendorPlan,
  listVendorInvoices,
  createVendorInvoice,
  updateVendorInvoice,
  updateVendorInvoiceStatus,
  deleteVendorInvoice,
  listClientInvoices,
  createPayment,
  verifyVendorPayment,
  listVendorSubscriptions,
  updateVendorSubscriptionStatus,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import type {
  StatusAudit,
  Subscription,
  SubscriptionSummary,
} from "@/types/api";
import {
  getClientInvoice,
  getClientSubscription,
  listClientInvoiceAudits,
  getVendorSubscriptionsSummary,
  listVendorAudits,
} from "@/services/api";
import { toast } from "sonner";

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

export function useVendorInvoices(
  params?: {
    limit?: number;
    cursor?: string;
    status?: string;
    periode?: string;
  },
  initialData?: Invoice[] | undefined
) {
  return useQuery({
    queryKey: QK.billing.vendor.invoices(),
    queryFn: async () => ensureSuccess(await listVendorInvoices(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useInfiniteVendorInvoices(
  params?: { limit?: number; status?: string; periode?: string },
  initial?: { initialData?: Invoice[]; initialCursor?: string }
) {
  const baseParams = params ?? {};
  return useInfiniteQuery({
    queryKey: QK.billing.vendor.invoicesInfinite(baseParams),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const res = await listVendorInvoices({
        ...baseParams,
        cursor: pageParam,
      });
      const items = ensureSuccess(res);
      const nextCursor = res.meta?.pagination?.next_cursor as
        | string
        | undefined;
      return { items, nextCursor } as { items: Invoice[]; nextCursor?: string };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    ...(initial?.initialData
      ? {
          initialData: {
            pages: [
              {
                items: initial.initialData,
                nextCursor: initial.initialCursor,
              },
            ],
            pageParams: [undefined],
          },
        }
      : {}),
    select(data) {
      return (data?.pages ?? []).flatMap((p) => p.items) ?? [];
    },
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
    queryFn: async () =>
      ensureSuccess(await getClientInvoice(id as string | number)),
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
    queryFn: async () =>
      ensureSuccess(
        await listClientInvoiceAudits(id as string | number, params)
      ),
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

export function useInfiniteVendorAudits(
  params?: { limit?: number },
  initial?: { initialData?: StatusAudit[]; initialCursor?: string }
) {
  const final = { limit: params?.limit ?? 50 };
  return useInfiniteQuery({
    queryKey: QK.billing.vendor.auditsInfinite(final),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const res = await listVendorAudits({
        limit: final.limit,
        cursor: pageParam,
      });
      const items = ensureSuccess(res);
      const nextCursor = res.meta?.pagination?.next_cursor as
        | string
        | undefined;
      return { items, nextCursor } as {
        items: StatusAudit[];
        nextCursor?: string;
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    ...(initial?.initialData
      ? {
          initialData: {
            pages: [
              {
                items: initial.initialData,
                nextCursor: initial.initialCursor,
              },
            ],
            pageParams: [undefined],
          },
        }
      : {}),
  });
}

export function useVendorSubscriptions(
  params?: { status?: string; limit?: number; cursor?: string },
  initialData?: Subscription[] | undefined
) {
  return useQuery({
    queryKey: QK.billing.vendor.subscriptions.list(params ?? {}),
    queryFn: async () => ensureSuccess(await listVendorSubscriptions(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useInfiniteVendorSubscriptions(
  params?: { status?: string; limit?: number },
  initial?: { initialData?: Subscription[]; initialCursor?: string }
) {
  const baseParams = params ?? {};
  return useInfiniteQuery({
    queryKey: QK.billing.vendor.subscriptions.infinite(baseParams),
    initialPageParam: undefined as string | undefined,
    queryFn: async ({ pageParam }) => {
      const res = await listVendorSubscriptions({
        ...baseParams,
        cursor: pageParam,
      });
      const items = ensureSuccess(res);
      const nextCursor = res.meta?.pagination?.next_cursor as
        | string
        | undefined;
      return { items, nextCursor } as {
        items: Subscription[];
        nextCursor?: string;
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    ...(initial?.initialData
      ? {
          initialData: {
            pages: [
              {
                items: initial.initialData,
                nextCursor: initial.initialCursor,
              },
            ],
            pageParams: [undefined],
          },
        }
      : {}),
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
      toast.success("Invoice berhasil dibuat");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal membuat invoice");
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
      toast.success("Invoice diperbarui");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memperbarui invoice");
    },
  });

  const updateVendorInvStatus = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      status: string;
      note?: string;
    }) =>
      ensureSuccess(
        await updateVendorInvoiceStatus(vars.id, {
          status: vars.status,
          note: vars.note,
        })
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
      toast.success("Status invoice diperbarui");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memperbarui status");
    },
  });

  const deleteVendorInv = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await deleteVendorInvoice(id)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
      toast.success("Invoice dihapus");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menghapus invoice");
    },
  });

  const createClientPayment = useMutation({
    mutationFn: async (vars: {
      invoiceId: string | number;
      payload: Partial<Payment>;
    }) => ensureSuccess(await createPayment(vars.invoiceId, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.client.invoices() });
      toast.success("Pembayaran terkirim");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal mengirim pembayaran");
    },
  });

  const verifyVendorPay = useMutation({
    mutationFn: async (vars: { id: string | number; payload?: any }) =>
      ensureSuccess(await verifyVendorPayment(vars.id, vars.payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.billing.vendor.invoices() });
      toast.success("Pembayaran diverifikasi");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal verifikasi pembayaran");
    },
  });

  const updatePlanStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(
        await updateVendorPlanStatus(vars.id, { status: vars.status })
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "billing" &&
          q.queryKey[1] === "vendor" &&
          q.queryKey[2] === "plans",
      });
      toast.success("Status plan diperbarui");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memperbarui status plan");
    },
  });

  const updateSubscriptionStatus = useMutation({
    mutationFn: async (vars: { id: string | number; status: string }) =>
      ensureSuccess(
        await updateVendorSubscriptionStatus(vars.id, { status: vars.status })
      ),
    onSuccess: () => {
      qc.invalidateQueries({
        predicate: (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === "billing" &&
          q.queryKey[1] === "vendor" &&
          q.queryKey[2] === "subscriptions",
      });
      toast.success("Status subscription diperbarui");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memperbarui status subscription");
    },
  });

  return {
    createPlan,
    updatePlan,
    updatePlanStatus,
    deletePlan,
    createVendorInv,
    updateVendorInv,
    updateVendorInvStatus,
    deleteVendorInv,
    createClientPayment,
    verifyVendorPay,
    updateSubscriptionStatus,
  } as const;
}
