/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import {
  listVendorInvoices,
  createVendorInvoice,
  updateVendorInvoice,
  deleteVendorInvoice,
  listClientInvoices,
  createPayment,
  listVendorPlans,
  createVendorPlan,
  getVendorPlan,
  updateVendorPlan,
  deleteVendorPlan,
} from "@/services/api";

export async function listInvoicesAction(type: "vendor" | "client" = "client") {
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
  payload: any
) {
  const res = await createPayment(invoiceId, payload);
  return ensureSuccess(res);
}

export type CreatePaymentActionResult = Awaited<
  ReturnType<typeof createPaymentAction>
>;

export async function createVendorInvoiceAction(payload: any) {
  const res = await createVendorInvoice(payload);
  return ensureSuccess(res);
}

export type CreateVendorInvoiceActionResult = Awaited<
  ReturnType<typeof createVendorInvoiceAction>
>;

export async function updateVendorInvoiceAction(
  id: string | number,
  payload: any,
) {
  const res = await updateVendorInvoice(id, payload);
  return ensureSuccess(res);
}

export type UpdateVendorInvoiceActionResult = Awaited<
  ReturnType<typeof updateVendorInvoiceAction>
>;

export async function deleteVendorInvoiceAction(id: string | number) {
  const res = await deleteVendorInvoice(id);
  return ensureSuccess(res);
}

export type DeleteVendorInvoiceActionResult = Awaited<
  ReturnType<typeof deleteVendorInvoiceAction>
>;

export async function listVendorPlansAction() {
  const res = await listVendorPlans();
  return ensureSuccess(res);
}

export type ListVendorPlansActionResult = Awaited<
  ReturnType<typeof listVendorPlansAction>
>;

export async function createVendorPlanAction(payload: any) {
  const res = await createVendorPlan(payload);
  return ensureSuccess(res);
}

export type CreateVendorPlanActionResult = Awaited<
  ReturnType<typeof createVendorPlanAction>
>;

export async function getVendorPlanAction(id: string | number) {
  const res = await getVendorPlan(id);
  return ensureSuccess(res);
}

export type GetVendorPlanActionResult = Awaited<
  ReturnType<typeof getVendorPlanAction>
>;

export async function updateVendorPlanAction(
  id: string | number,
  payload: any,
) {
  const res = await updateVendorPlan(id, payload);
  return ensureSuccess(res);
}

export type UpdateVendorPlanActionResult = Awaited<
  ReturnType<typeof updateVendorPlanAction>
>;

export async function deleteVendorPlanAction(id: string | number) {
  const res = await deleteVendorPlan(id);
  return ensureSuccess(res);
}

export type DeleteVendorPlanActionResult = Awaited<
  ReturnType<typeof deleteVendorPlanAction>
>;
