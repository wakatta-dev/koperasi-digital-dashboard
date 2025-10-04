/** @format */

"use client";

import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import useSWR from "swr";
import { format as formatDate } from "date-fns";

import { ensureSuccess } from "@/lib/api";
import { API_PREFIX, api } from "@/services/api";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  VendorClientInsight,
  VendorDashboard,
  VendorProductInsight,
  VendorProductTierSummary,
} from "@/types/api";
import {
  useVendorDashboardFilters,
  type VendorDashboardFilterState,
} from "./vendor-dashboard-filter-context";

function buildDashboardQuery(
  filters: VendorDashboardFilterState
): string | null {
  const params = new URLSearchParams();
  const { dateRange, tenantType, subscriptionStatus } = filters;
  if (dateRange?.from) {
    params.set("start_date", formatDate(dateRange.from, "yyyy-MM-dd"));
  }
  if (dateRange?.to) {
    params.set("end_date", formatDate(dateRange.to, "yyyy-MM-dd"));
  }
  if (tenantType && tenantType !== "all") {
    params.set("tenant_type", tenantType);
  }
  if (subscriptionStatus && subscriptionStatus !== "all") {
    params.set("subscription_status", subscriptionStatus);
  }
  const query = params.toString();
  return query.length ? query : null;
}

async function fetchVendorDashboard(
  query?: string | null
): Promise<VendorDashboard> {
  const basePath = `${API_PREFIX}${API_ENDPOINTS.vendor.dashboard}`;
  const path = query ? `${basePath}?${query}` : basePath;
  const response = await api.get<VendorDashboard>(path);
  return ensureSuccess(response);
}

type VendorDashboardDataContextValue = {
  data: VendorDashboard | null;
  tiers: VendorProductTierSummary[];
  totalActiveClients: number;
  openTickets: number;
  mostActiveClient: VendorClientInsight | null;
  productWithMostTickets: VendorProductInsight | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refresh: () => Promise<VendorDashboard | undefined>;
  isValidating: boolean;
};

const VendorDashboardDataContext =
  createContext<VendorDashboardDataContextValue | null>(null);

export function VendorDashboardDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { filters } = useVendorDashboardFilters();
  const queryKey = useMemo(() => buildDashboardQuery(filters), [filters]);

  const { data, error, isLoading, isValidating, mutate } =
    useSWR<VendorDashboard>(
      ["vendor-dashboard", queryKey],
      async ([, query]) => fetchVendorDashboard(query as string),
      {
        keepPreviousData: true,
        revalidateOnFocus: false,
      }
    );

  const value = useMemo<VendorDashboardDataContextValue>(() => {
    const tiers = (data?.client_totals_by_tier ??
      []) as VendorProductTierSummary[];
    const totalActiveClients = tiers.reduce(
      (total, tier) => total + (tier?.active_clients ?? 0),
      0
    );

    return {
      data: data ?? null,
      tiers,
      totalActiveClients,
      openTickets: data?.open_tickets ?? 0,
      mostActiveClient: data?.most_active_client ?? null,
      productWithMostTickets: data?.product_with_most_tickets ?? null,
      isLoading,
      isError: Boolean(error),
      error:
        error instanceof Error
          ? error
          : error
          ? new Error(String(error))
          : null,
      refresh: () => mutate(),
      isValidating,
    };
  }, [data, error, isLoading, isValidating, mutate]);

  return (
    <VendorDashboardDataContext.Provider value={value}>
      {children}
    </VendorDashboardDataContext.Provider>
  );
}

export function useVendorDashboardData() {
  const ctx = useContext(VendorDashboardDataContext);
  if (!ctx) {
    throw new Error(
      "useVendorDashboardData must be used within VendorDashboardDataProvider"
    );
  }
  return ctx;
}
