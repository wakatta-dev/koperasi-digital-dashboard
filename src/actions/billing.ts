/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import {
  listVendorInvoices,
  listClientInvoices,
  createPayment,
} from "@/services/api";

export async function listInvoicesAction(
  type: "vendor" | "client" = "client"
) {
  const res =
    type === "vendor"
      ? await listVendorInvoices()
      : await listClientInvoices();
  return ensureSuccess(res);
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
