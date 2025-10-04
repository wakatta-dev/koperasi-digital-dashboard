/** @format */

"use client";

import { useMemo } from "react";
import useSWR from "swr";
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

  const paramsKey = JSON.stringify({ start, end });

  const swr = useSWR<BillingReportResponse>(
    ["vendor-dashboard", "billing-report", paramsKey],
    async () => ensureSuccess(await getBillingReport({ start, end })),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return swr;
}

