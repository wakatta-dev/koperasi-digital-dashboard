/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import type {
  Plan,
  Invoice,
  Payment,
  Subscription,
  SubscriptionSummary,
  StatusAudit,
} from "@/types/api";
import {
  listVendorInvoices,
  createVendorInvoice,
  updateVendorInvoice,
  deleteVendorInvoice,
  listClientInvoices,
  createPayment,
  verifyVendorPayment,
  listVendorPlans,
  createVendorPlan,
  getVendorPlan,
  updateVendorPlan,
  deleteVendorPlan,
  getClientInvoice,
  listClientInvoiceAudits,
  getClientSubscription,
  getVendorSubscriptionsSummary,
  listVendorAudits,
} from "@/services/api";

export async function listInvoicesAction(
  type: "vendor" | "client" = "client",
): Promise<Invoice[]> {
  try {
    const res =
      type === "vendor"
        ? await listVendorInvoices()
        : await listClientInvoices();

    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListInvoicesActionResult = Awaited<
  ReturnType<typeof listInvoicesAction>
>;

export async function createPaymentAction(
  invoiceId: string | number,
  payload: Partial<Payment>,
): Promise<Payment | null> {
  try {
    const res = await createPayment(invoiceId, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreatePaymentActionResult = Awaited<
  ReturnType<typeof createPaymentAction>
>;

export async function verifyVendorPaymentAction(
  id: string | number,
  payload?: Partial<Payment> & { status?: string; gateway?: string; external_id?: string },
): Promise<Payment | null> {
  try {
    const res = await verifyVendorPayment(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type VerifyVendorPaymentActionResult = Awaited<
  ReturnType<typeof verifyVendorPaymentAction>
>;

export async function createVendorInvoiceAction(
  payload: Partial<Invoice>,
): Promise<Invoice | null> {
  try {
    const res = await createVendorInvoice(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreateVendorInvoiceActionResult = Awaited<
  ReturnType<typeof createVendorInvoiceAction>
>;

export async function updateVendorInvoiceAction(
  id: string | number,
  payload: Partial<Invoice>,
): Promise<Invoice | null> {
  try {
    const res = await updateVendorInvoice(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type UpdateVendorInvoiceActionResult = Awaited<
  ReturnType<typeof updateVendorInvoiceAction>
>;

export async function deleteVendorInvoiceAction(
  id: string | number,
): Promise<{ id: number } | null> {
  try {
    const res = await deleteVendorInvoice(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type DeleteVendorInvoiceActionResult = Awaited<
  ReturnType<typeof deleteVendorInvoiceAction>
>;

export async function listVendorPlansAction(params: {
  limit: number;
  cursor?: string;
}): Promise<Plan[]> {
  try {
    const res = await listVendorPlans(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListVendorPlansActionResult = Awaited<
  ReturnType<typeof listVendorPlansAction>
>;

export async function createVendorPlanAction(
  payload: Partial<Plan>,
): Promise<Plan | null> {
  try {
    const res = await createVendorPlan(payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type CreateVendorPlanActionResult = Awaited<
  ReturnType<typeof createVendorPlanAction>
>;

export async function getVendorPlanAction(
  id: string | number,
): Promise<Plan | null> {
  try {
    const res = await getVendorPlan(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type GetVendorPlanActionResult = Awaited<
  ReturnType<typeof getVendorPlanAction>
>;

export async function updateVendorPlanAction(
  id: string | number,
  payload: Partial<Plan>,
): Promise<Plan | null> {
  try {
    const res = await updateVendorPlan(id, payload);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type UpdateVendorPlanActionResult = Awaited<
  ReturnType<typeof updateVendorPlanAction>
>;

export async function deleteVendorPlanAction(
  id: string | number,
): Promise<unknown | null> {
  try {
    const res = await deleteVendorPlan(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export type DeleteVendorPlanActionResult = Awaited<
  ReturnType<typeof deleteVendorPlanAction>
>;

export async function getClientInvoiceAction(
  id: string | number,
): Promise<Invoice | null> {
  try {
    const res = await getClientInvoice(id);
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function listClientInvoiceAuditsAction(
  id: string | number,
  params?: { limit?: number; cursor?: string },
): Promise<StatusAudit[]> {
  try {
    const res = await listClientInvoiceAudits(id, params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export async function getClientSubscriptionAction(): Promise<Subscription | null> {
  try {
    const res = await getClientSubscription();
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function getVendorSubscriptionsSummaryAction(): Promise<
  SubscriptionSummary | null
> {
  try {
    const res = await getVendorSubscriptionsSummary();
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function listVendorAuditsAction(params?: {
  limit?: number;
  cursor?: string;
}): Promise<StatusAudit[]> {
  try {
    const res = await listVendorAudits(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}
