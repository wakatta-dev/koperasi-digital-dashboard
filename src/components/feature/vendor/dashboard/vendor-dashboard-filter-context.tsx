/** @format */

"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DateRange } from "react-day-picker";

export type VendorTenantTypeFilter = "all" | "koperasi" | "bumdes" | "umkm";
export type VendorSubscriptionStatusFilter =
  | "all"
  | "active"
  | "trial"
  | "cancelled"
  | "expired";

export type VendorDashboardFilterState = {
  dateRange: DateRange | null;
  tenantType: VendorTenantTypeFilter;
  subscriptionStatus: VendorSubscriptionStatusFilter;
};

const defaultState: VendorDashboardFilterState = {
  dateRange: null,
  tenantType: "all",
  subscriptionStatus: "all",
};

export type VendorDashboardFilterContextValue = {
  filters: VendorDashboardFilterState;
  setDateRange: (range: DateRange | null) => void;
  setTenantType: (tenantType: VendorTenantTypeFilter) => void;
  setSubscriptionStatus: (
    subscriptionStatus: VendorSubscriptionStatusFilter,
  ) => void;
  reset: () => void;
};

const VendorDashboardFilterContext =
  createContext<VendorDashboardFilterContextValue | null>(null);

export function VendorDashboardFilterProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: VendorDashboardFilterState;
}) {
  const [filters, setFilters] = useState<VendorDashboardFilterState>(
    initialState ?? defaultState,
  );

  const value = useMemo<VendorDashboardFilterContextValue>(() => ({
    filters,
    setDateRange: (range) => {
      setFilters((prev) => ({ ...prev, dateRange: range }));
    },
    setTenantType: (tenantType) => {
      setFilters((prev) => ({ ...prev, tenantType }));
    },
    setSubscriptionStatus: (subscriptionStatus) => {
      setFilters((prev) => ({ ...prev, subscriptionStatus }));
    },
    reset: () => setFilters(initialState ?? defaultState),
  }), [filters, initialState]);

  return (
    <VendorDashboardFilterContext.Provider value={value}>
      {children}
    </VendorDashboardFilterContext.Provider>
  );
}

export function useVendorDashboardFilters() {
  const ctx = useContext(VendorDashboardFilterContext);
  if (!ctx) {
    throw new Error(
      "useVendorDashboardFilters must be used within VendorDashboardFilterProvider",
    );
  }
  return ctx;
}
