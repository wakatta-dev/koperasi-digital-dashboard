/** @format */

"use server";

import { ensureSuccess } from "@/lib/api";
import type { BillingReportResponse, FinanceReportResponse } from "@/types/api";
import { getBillingReport, getFinanceReport, getTenantId } from "@/services/api";

export async function getFinanceReportAction(params?: {
  tenant_id?: string | number;
  start?: string;
  end?: string;
}): Promise<FinanceReportResponse | null> {
  try {
    const tid = params?.tenant_id ?? (await getTenantId());
    const res = await getFinanceReport({ ...params, ...(tid ? { tenant_id: tid } : {}) });
    return ensureSuccess(res);
  } catch {
    return null;
  }
}

export async function getBillingReportAction(params?: {
  tenant_id?: string | number;
  start?: string;
  end?: string;
}): Promise<BillingReportResponse | null> {
  try {
    const tid = params?.tenant_id ?? (await getTenantId());
    const res = await getBillingReport({ ...params, ...(tid ? { tenant_id: tid } : {}) });
    return ensureSuccess(res);
  } catch {
    return null;
  }
}
