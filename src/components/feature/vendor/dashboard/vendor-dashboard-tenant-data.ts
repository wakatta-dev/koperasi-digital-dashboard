/** @format */

"use client";

import { useMemo } from "react";
import { useQuery, type UseQueryResult } from "@tanstack/react-query";

import { ensureSuccess } from "@/lib/api";
import {
  listClients,
  listVendorSubscriptions,
  getVendorSubscriptionsSummary,
} from "@/services/api";
import type { Client, Subscription, SubscriptionSummary } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";

export type VendorDashboardTenantUniverse = {
  clientsState: UseQueryResult<Client[], Error>;
  subscriptionsState: UseQueryResult<Subscription[], Error>;
  subscriptionSummaryState: UseQueryResult<SubscriptionSummary | null, Error>;
  filteredClients: Client[];
  filteredClientIds: Set<number>;
  filteredSubscriptions: Subscription[];
  subscriptionStatusByTenant: Map<number, Subscription["status"]>;
  tenantDataLoading: boolean;
  tenantDataError: unknown;
};

export function useVendorDashboardTenantUniverse(): VendorDashboardTenantUniverse {
  const { filters } = useVendorDashboardFilters();

  const tenantTypeParam =
    filters.tenantType !== "all" ? filters.tenantType : undefined;
  const subscriptionStatusParam = mapSubscriptionStatusFilter(
    filters.subscriptionStatus,
  );

  const clientParams = useMemo(
    () => ({
      limit: 200,
      ...(tenantTypeParam ? { type: tenantTypeParam } : {}),
    }),
    [tenantTypeParam],
  );

  const clientsState = useQuery<Client[], Error>({
    queryKey: ["vendor-dashboard", "clients", clientParams],
    queryFn: async () => ensureSuccess(await listClients(clientParams)),
    keepPreviousData: true,
  });

  const subscriptionSummaryState = useQuery<SubscriptionSummary | null, Error>({
    queryKey: ["vendor-dashboard", "subscriptions", "summary"],
    queryFn: async () => ensureSuccess(await getVendorSubscriptionsSummary()),
  });

  const subscriptionParams = useMemo(
    () => ({
      limit: 200,
      ...(subscriptionStatusParam ? { status: subscriptionStatusParam } : {}),
    }),
    [subscriptionStatusParam],
  );

  const subscriptionsState = useQuery<Subscription[], Error>({
    queryKey: ["vendor-dashboard", "subscriptions", subscriptionParams],
    queryFn: async () => ensureSuccess(await listVendorSubscriptions(subscriptionParams)),
    keepPreviousData: true,
  });

  const subscriptionStatusByTenant = useMemo(() => {
    const map = new Map<number, Subscription["status"]>();
    for (const sub of subscriptionsState.data ?? []) {
      if (typeof sub?.tenant_id === "number" && sub.status) {
        map.set(sub.tenant_id, sub.status);
      }
    }
    return map;
  }, [subscriptionsState.data]);

  const filteredClients = useMemo(() => {
    return (clientsState.data ?? []).filter((client) =>
      matchesTenantFilters(client, filters.subscriptionStatus, subscriptionStatusByTenant),
    );
  }, [clientsState.data, filters.subscriptionStatus, subscriptionStatusByTenant]);

  const filteredClientIds = useMemo(
    () => new Set(filteredClients.map((client) => client.id)),
    [filteredClients],
  );

  const filteredSubscriptions = useMemo(() => {
    return (subscriptionsState.data ?? []).filter((subscription) =>
      filteredClientIds.has(subscription.tenant_id),
    );
  }, [filteredClientIds, subscriptionsState.data]);

  const tenantDataLoading = Boolean(
    clientsState.isLoading ||
      clientsState.isFetching ||
      subscriptionsState.isLoading ||
      subscriptionsState.isFetching,
  );

  const tenantDataError = clientsState.error ?? subscriptionsState.error ?? null;

  return {
    clientsState,
    subscriptionsState,
    subscriptionSummaryState,
    filteredClients,
    filteredClientIds,
    filteredSubscriptions,
    subscriptionStatusByTenant,
    tenantDataLoading,
    tenantDataError,
  };
}

export function mapSubscriptionStatusFilter(
  filter: ReturnType<typeof useVendorDashboardFilters>["filters"]["subscriptionStatus"],
) {
  switch (filter) {
    case "active":
      return "active";
    case "trial":
      return "pending";
    case "cancelled":
      return "terminated";
    case "expired":
      return "overdue";
    default:
      return undefined;
  }
}

export function translateSubscriptionFilter(
  filter: ReturnType<typeof useVendorDashboardFilters>["filters"]["subscriptionStatus"],
) {
  switch (filter) {
    case "active":
      return "aktif";
    case "trial":
      return "trial";
    case "cancelled":
      return "dibatalkan";
    case "expired":
      return "kedaluwarsa";
    default:
      return "semua status";
  }
}

export function matchesTenantFilters(
  client: Client,
  filter: ReturnType<typeof useVendorDashboardFilters>["filters"]["subscriptionStatus"],
  subscriptionStatusByTenant: Map<number, Subscription["status"]>,
) {
  const subscriptionStatus = subscriptionStatusByTenant.get(client.id);

  switch (filter) {
    case "active":
      return client.status === "active";
    case "trial":
      return (
        client.status === "inactive" ||
        client.status === "suspended" ||
        subscriptionStatus === "pending"
      );
    case "cancelled":
      return (
        client.status === "inactive" ||
        subscriptionStatus === "terminated" ||
        subscriptionStatus === "paused"
      );
    case "expired":
      return (
        client.status === "suspended" ||
        subscriptionStatus === "overdue"
      );
    default:
      return true;
  }
}
