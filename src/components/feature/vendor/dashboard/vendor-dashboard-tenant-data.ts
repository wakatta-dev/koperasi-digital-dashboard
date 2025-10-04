/** @format */

"use client";

import { useMemo } from "react";
import useSWR, { type SWRResponse } from "swr";

import { ensureSuccess } from "@/lib/api";
import {
  listClients,
  listVendorSubscriptions,
  getVendorSubscriptionsSummary,
} from "@/services/api";
import type { Client, Subscription, SubscriptionSummary } from "@/types/api";

import { useVendorDashboardFilters } from "./vendor-dashboard-filter-context";

export type VendorDashboardTenantUniverse = {
  clientsState: SWRResponse<Client[], any>;
  subscriptionsState: SWRResponse<Subscription[], any>;
  subscriptionSummaryState: SWRResponse<SubscriptionSummary | null, any>;
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

  const clientsState = useSWR<Client[]>(
    ["vendor-dashboard", "clients", clientParams],
    async ([, , params]) => ensureSuccess(await listClients(params)),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const subscriptionSummaryState = useSWR<SubscriptionSummary | null>(
    ["vendor-dashboard", "subscriptions", "summary"],
    async () => ensureSuccess(await getVendorSubscriptionsSummary()),
    {
      revalidateOnFocus: false,
    },
  );

  const subscriptionParams = useMemo(
    () => ({
      limit: 200,
      ...(subscriptionStatusParam ? { status: subscriptionStatusParam } : {}),
    }),
    [subscriptionStatusParam],
  );

  const subscriptionsState = useSWR<Subscription[]>(
    ["vendor-dashboard", "subscriptions", subscriptionParams],
    async ([, , params]) => ensureSuccess(await listVendorSubscriptions(params)),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

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
      clientsState.isValidating ||
      subscriptionsState.isLoading ||
      subscriptionsState.isValidating,
  );

  const tenantDataError = clientsState.error || subscriptionsState.error;

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
