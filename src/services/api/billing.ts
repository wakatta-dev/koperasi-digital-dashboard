/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  ApiResponse,
  Plan,
  Invoice,
  Payment,
  PaymentRequest,
  VerifyPaymentRequest,
  SubscriptionSummary,
  StatusAudit,
  Subscription,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listVendorPlans(
  params?: {
    term?: string;
    status?: "active" | "inactive";
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<Plan[]>> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.status) search.set("status", params.status);
  const q = search.toString();
  return api.get<Plan[]>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plans}${q ? `?${q}` : ""}`,
    { signal: opts?.signal }
  );
}

export function createVendorPlan(
  payload: Partial<Plan>
): Promise<ApiResponse<Plan>> {
  return api.post<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plans}`,
    payload
  );
}

export function getVendorPlan(id: string | number): Promise<ApiResponse<Plan>> {
  return api.get<Plan>(`${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`);
}

export function updateVendorPlan(
  id: string | number,
  payload: Partial<Plan>
): Promise<ApiResponse<Plan>> {
  return api.put<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`,
    payload
  );
}

export function updateVendorPlanStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<Plan>> {
  return api.patch<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.planStatus(id)}`,
    payload
  );
}

export function deleteVendorPlan(
  id: string | number
): Promise<ApiResponse<any>> {
  return api.delete<any>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`
  );
}

export function listVendorInvoices(
  params?: {
    tenant?: string | number;
    business_unit_id?: string | number;
    year?: string;
    status?: "draft" | "issued" | "paid" | "overdue";
    term?: string;
    limit?: number;
    cursor?: string;
  },
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<Invoice[]>> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.tenant) search.set("tenant", String(params.tenant));
  if (params?.business_unit_id)
    search.set("business_unit_id", String(params.business_unit_id));
  if (params?.year) search.set("year", params.year);
  if (params?.status) search.set("status", params.status);
  if (params?.term) search.set("term", params.term);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoicesBase}`;
  return api.get<Invoice[]>(q ? `${base}?${q}` : base, { signal: opts?.signal });
}

export function createVendorInvoice(
  payload: Partial<Invoice>
): Promise<ApiResponse<Invoice>> {
  return api.post<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoicesBase}`,
    payload
  );
}

export function updateVendorInvoice(
  id: string | number,
  payload: Partial<Invoice>
): Promise<ApiResponse<Invoice>> {
  return api.patch<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoice(id)}`,
    payload
  );
}

export function getVendorInvoice(
  id: string | number
): Promise<ApiResponse<Invoice>> {
  return api.get<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoice(id)}`
  );
}

export function deleteVendorInvoice(
  id: string | number
): Promise<ApiResponse<any>> {
  return api.delete<any>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoice(id)}`
  );
}

export function updateVendorInvoiceStatus(
  id: string | number,
  payload: { status: "issued" | "paid" | "overdue"; note?: string }
): Promise<ApiResponse<Invoice>> {
  return api.patch<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoiceStatus(id)}`,
    payload
  );
}

export function sendVendorInvoiceEmail(
  id: string | number
): Promise<ApiResponse<{ message: string }>> {
  return api.post<{ message: string }>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoiceSend(id)}`,
    {}
  );
}

// Download invoice PDF using raw fetch (returns Blob)
export async function downloadVendorInvoicePdf(
  id: string | number
): Promise<Blob> {
  const { getAccessToken } = await import("../auth");
  const accessToken = await getAccessToken();
  const tenantId = await (await import("./base")).getTenantId();
  const headers: Record<string, string> = { Accept: "application/pdf" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  if (tenantId) headers["X-Tenant-ID"] = tenantId;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoicePdf(id)}`,
    { method: "GET", headers }
  );
  if (!res.ok) throw new Error(res.statusText);
  return await res.blob();
}

export function listClientInvoices(
  params?: {
    limit?: number;
    cursor?: string;
    term?: string;
    status?: Invoice["status"];
    year?: string;
    business_unit_id?: string | number;
  },
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<Invoice[]>> {
  const search = new URLSearchParams();
  search.set("limit", String(params?.limit ?? 10));
  if (params?.cursor) search.set("cursor", params.cursor);
  if (params?.term) search.set("term", params.term);
  if (params?.status) search.set("status", params.status);
  if (params?.year) search.set("year", params.year);
  if (params?.business_unit_id)
    search.set("business_unit_id", String(params.business_unit_id));
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.billing.client.invoicesBase}`;
  return api.get<Invoice[]>(q ? `${base}?${q}` : base, { signal: opts?.signal });
}

export function createPayment(
  invoiceId: string | number,
  payload: PaymentRequest
): Promise<ApiResponse<Payment>> {
  return api.post<Payment>(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.invoice(invoiceId).payments}`,
    payload
  );
}

export function verifyVendorPayment(
  id: string | number,
  payload: VerifyPaymentRequest
): Promise<ApiResponse<Payment>> {
  return api.patch<Payment>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.payments(id).verify}`,
    payload
  );
}

// Additional endpoints based on docs/modules/billing.md

export function getVendorSubscriptionsSummary(): Promise<
  ApiResponse<SubscriptionSummary>
> {
  return api.get<SubscriptionSummary>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.subscriptions.summary}`
  );
}

export function listVendorSubscriptions(params?: {
  status?: string;
  limit?: number;
  cursor?: string;
}, opts?: { signal?: AbortSignal }): Promise<ApiResponse<Subscription[]>> {
  const search = new URLSearchParams();
  if (params?.status) search.set("status", params.status);
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.billing.vendor.subscriptions.list}`;
  return api.get<Subscription[]>(q ? `${base}?${q}` : base, { signal: opts?.signal });
}

export function updateVendorSubscriptionStatus(
  id: string | number,
  payload: { status: string }
): Promise<ApiResponse<Subscription>> {
  return api.patch<Subscription>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.subscriptions.status(id)}`,
    payload
  );
}

export function listVendorAudits(params?: {
  limit?: number;
  cursor?: string;
}, opts?: { signal?: AbortSignal }): Promise<ApiResponse<StatusAudit[]>> {
  const final = { limit: params?.limit ?? 100, cursor: params?.cursor } as {
    limit: number;
    cursor?: string;
  };
  const search = new URLSearchParams({ limit: String(final.limit) });
  if (final.cursor) search.set("cursor", final.cursor);
  return api.get<StatusAudit[]>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.audits(
      final.limit,
      final.cursor
    )}`,
    { signal: opts?.signal }
  );
}

export function getClientInvoice(
  id: string | number
): Promise<ApiResponse<Invoice>> {
  return api.get<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.invoice(id).detail}`
  );
}

export function listClientInvoiceAudits(
  id: string | number,
  params?: { limit?: number; cursor?: string },
  opts?: { signal?: AbortSignal }
): Promise<ApiResponse<StatusAudit[]>> {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.cursor) search.set("cursor", params.cursor);
  const q = search.toString();
  const base = `${API_PREFIX}${API_ENDPOINTS.billing.client.invoice(id).audits}`;
  return api.get<StatusAudit[]>(q ? `${base}?${q}` : base, { signal: opts?.signal });
}

export function getClientSubscription(): Promise<ApiResponse<Subscription>> {
  return api.get<Subscription>(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.subscription}`
  );
}
