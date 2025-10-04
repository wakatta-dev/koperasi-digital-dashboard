/** @format */

"use client";

import { useMemo } from "react";
import { useQuery, type UseQueryResult, useQueryClient } from "@tanstack/react-query";

import { ensureSuccess } from "@/lib/api";
import { buildReactQueryRetry } from "@/lib/rate-limit";
import {
  listClients,
  listVendorSubscriptions,
  getVendorSubscriptionsSummary,
} from "@/services/api";
import type { Client, Subscription, SubscriptionSummary } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";

export type VendorDashboardTenantUniverse = {
  clientsQuery: UseQueryResult<Client[], unknown>;
  subscriptionsQuery: UseQueryResult<Subscription[], unknown>;
  subscriptionSummaryQuery: UseQueryResult<SubscriptionSummary | null, unknown>;
  filteredClients: Client[];
  filteredClientIds: Set<number>;
  filteredSubscriptions: Subscription[];
  subscriptionStatusByTenant: Map<number, Subscription["status"]>;
  tenantDataLoading: boolean;
  tenantDataError: unknown;
  invalidateTenantUniverse: () => Promise<void>;
};

export function useVendorDashboardTenantUniverse(): VendorDashboardTenantUniverse {
  const { filters } = useVendorDashboardFilters();
  const queryClient = useQueryClient();

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

  const clientsQueryKey = useMemo(
    () => ["vendor-dashboard", "clients", clientParams] as const,
    [clientParams]
  );

  const clientsQuery = useQuery({
    queryKey: clientsQueryKey,
    queryFn: async ({ queryKey: [, , params] }) =>
      ensureSuccess(
        await listClients(params as typeof clientParams)
      ),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const subscriptionSummaryQueryKey = [
    "vendor-dashboard",
    "subscriptions",
    "summary",
  ] as const;

  const subscriptionSummaryQuery = useQuery({
    queryKey: subscriptionSummaryQueryKey,
    queryFn: async () => ensureSuccess(await getVendorSubscriptionsSummary()),
    staleTime: 10 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const subscriptionParams = useMemo(
    () => ({
      limit: 200,
      ...(subscriptionStatusParam ? { status: subscriptionStatusParam } : {}),
    }),
    [subscriptionStatusParam],
  );

  const subscriptionsQueryKey = useMemo(
    () => ["vendor-dashboard", "subscriptions", subscriptionParams] as const,
    [subscriptionParams]
  );

  const subscriptionsQuery = useQuery({
    queryKey: subscriptionsQueryKey,
    queryFn: async ({ queryKey: [, , params] }) =>
      ensureSuccess(
        await listVendorSubscriptions(params as typeof subscriptionParams)
      ),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: buildReactQueryRetry(),
  });

  const subscriptionStatusByTenant = useMemo(() => {
    const map = new Map<number, Subscription["status"]>();
    for (const sub of subscriptionsQuery.data ?? []) {
      if (typeof sub?.tenant_id === "number" && sub.status) {
        map.set(sub.tenant_id, sub.status);
      }
    }
    return map;
  }, [subscriptionsQuery.data]);

  const filteredClients = useMemo(() => {
    return (clientsQuery.data ?? []).filter((client) =>
      matchesTenantFilters(client, filters.subscriptionStatus, subscriptionStatusByTenant),
    );
  }, [clientsQuery.data, filters.subscriptionStatus, subscriptionStatusByTenant]);

  const filteredClientIds = useMemo(
    () => new Set(filteredClients.map((client) => client.id)),
    [filteredClients],
  );

  const filteredSubscriptions = useMemo(() => {
    return (subscriptionsQuery.data ?? []).filter((subscription) =>
      filteredClientIds.has(subscription.tenant_id),
    );
  }, [filteredClientIds, subscriptionsQuery.data]);

  const tenantDataLoading = Boolean(
    clientsQuery.isLoading ||
      clientsQuery.isFetching ||
      subscriptionsQuery.isLoading ||
      subscriptionsQuery.isFetching,
  );

  const tenantDataError = clientsQuery.error || subscriptionsQuery.error;

  async function invalidateTenantUniverse() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["vendor-dashboard", "clients"] }),
      queryClient.invalidateQueries({
        queryKey: ["vendor-dashboard", "subscriptions"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["vendor-dashboard", "subscriptions", "summary"],
      }),
    ]);
  }

  return {
    clientsQuery,
    subscriptionsQuery,
    subscriptionSummaryQuery,
    filteredClients,
    filteredClientIds,
    filteredSubscriptions,
    subscriptionStatusByTenant,
    tenantDataLoading,
    tenantDataError,
    invalidateTenantUniverse,
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
