/** @format */

"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import type { VendorFinancialReport, VendorUsageReport } from "@/types/api";
import type { VendorDashboard } from "@/types/dashboard";
import {
  getVendorDashboard,
  getVendorFinancialReport,
  getVendorUsageReport,
  exportVendorReportRaw,
  listVendorReportExports,
} from "@/services/api/vendor";

export function useVendorDashboard(initialData?: VendorDashboard | undefined) {
  return useQuery({
    queryKey: ["vendor", "dashboard"],
    queryFn: async () => ensureSuccess(await getVendorDashboard()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorFinancial(params?: {
  start_date?: string;
  end_date?: string;
  group_by?: string;
}, initialData?: VendorFinancialReport | undefined) {
  return useQuery({
    queryKey: ["vendor", "reports", "financial", params ?? {}],
    queryFn: async () => ensureSuccess(await getVendorFinancialReport(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorUsage(
  params?: { tenant?: string | number; module?: string },
  initialData?: VendorUsageReport | undefined
) {
  return useQuery({
    queryKey: ["vendor", "reports", "usage", params ?? {}],
    queryFn: async () => ensureSuccess(await getVendorUsageReport(params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorReportExports(initialData?: any[] | undefined) {
  return useQuery({
    queryKey: ["vendor", "reports", "exports"],
    queryFn: async () => ensureSuccess(await listVendorReportExports()),
    ...(initialData ? { initialData } : {}),
  });
}

export function useVendorReportActions() {
  const exportReport = useMutation({
    mutationFn: async (payload: { report_type: string; format: string; params?: any }) =>
      await exportVendorReportRaw(payload),
  });

  return { exportReport } as const;
}

