/** @format */

"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format as formatDate } from "date-fns";

import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import { getBillingReport } from "@/services/api";

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

export function useVendorBillingReport(options?: { enabled?: boolean }) {
  const { start, end } = useVendorDashboardDateParams();

  return useQuery({
    queryKey: ["vendor-dashboard", "billing-report", { start, end }],
    queryFn: async () => ensureSuccess(await getBillingReport({ start, end })),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: buildReactQueryRetry(),
    enabled: options?.enabled ?? true,
  });
}
