/** @format */

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format as formatDate } from "date-fns";

import { ensureSuccess } from "@/lib/api";
import { getBillingReport } from "@/services/api";
import type { BillingReportResponse } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";

export function useVendorDashboardDateParams() {
  const { filters } = useVendorDashboardFilters();

  return useMemo(() => {
    const { dateRange } = filters;
    const start = dateRange?.from ? formatDate(dateRange.from, "yyyy-MM-dd") : undefined;
    const end = dateRange?.to ? formatDate(dateRange.to, "yyyy-MM-dd") : undefined;

    return {
      hasRange: Boolean(start || end),
      start,
      end,
    } as const;
  }, [filters]);
}

export function useVendorBillingReport() {
  const { start, end } = useVendorDashboardDateParams();

  const paramsKey = useMemo(() => ({ start, end }), [start, end]);

  return useQuery<BillingReportResponse>({
    queryKey: ["vendor-dashboard", "billing-report", paramsKey],
    queryFn: async () => ensureSuccess(await getBillingReport({ start, end })),
    keepPreviousData: true,
  });
}

