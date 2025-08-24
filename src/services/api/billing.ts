/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, Plan, Invoice, Payment } from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listVendorPlans(): Promise<ApiResponse<Plan[]>> {
  return api.get<Plan[]>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plans}`,
  );
}

export function createVendorPlan(
  payload: Partial<Plan>,
): Promise<ApiResponse<Plan>> {
  return api.post<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plans}`,
    payload,
  );
}

export function getVendorPlan(
  id: string | number,
): Promise<ApiResponse<Plan>> {
  return api.get<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`,
  );
}

export function updateVendorPlan(
  id: string | number,
  payload: Partial<Plan>,
): Promise<ApiResponse<Plan>> {
  return api.put<Plan>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`,
    payload,
  );
}

export function deleteVendorPlan(
  id: string | number,
): Promise<ApiResponse<any>> {
  return api.delete<any>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.plan(id)}`,
  );
}

export function listVendorInvoices(): Promise<ApiResponse<Invoice[]>> {
  return api.get<Invoice[]>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoices}`,
  );
}

export function createVendorInvoice(
  payload: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> {
  return api.post<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoices}`,
    payload,
  );
}

export function updateVendorInvoice(
  id: string | number,
  payload: Partial<Invoice>,
): Promise<ApiResponse<Invoice>> {
  return api.put<Invoice>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoice(id)}`,
    payload,
  );
}

export function deleteVendorInvoice(
  id: string | number,
): Promise<ApiResponse<any>> {
  return api.delete<any>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.invoice(id)}`,
  );
}

export function listClientInvoices(): Promise<ApiResponse<Invoice[]>> {
  return api.get<Invoice[]>(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.invoices}`,
  );
}

export function createPayment(
  invoiceId: string | number,
  payload: Partial<Payment>,
): Promise<ApiResponse<Payment>> {
  return api.post<Payment>(
    `${API_PREFIX}${API_ENDPOINTS.billing.client.invoice(invoiceId).payments}`,
    payload,
  );
}

export function verifyVendorPayment(
  id: string | number,
): Promise<ApiResponse<Payment>> {
  return api.patch<Payment>(
    `${API_PREFIX}${API_ENDPOINTS.billing.vendor.payments(id).verify}`,
  );
}
