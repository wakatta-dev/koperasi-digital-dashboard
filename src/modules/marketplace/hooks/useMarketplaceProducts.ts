/** @format */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";
import {
  addMarketplaceCartItem,
  ensureMarketplaceSuccess,
  getMarketplaceCustomerDetail,
  listMarketplaceCustomers,
  getMarketplaceCart,
  getMarketplaceProductDetail,
  getMarketplaceProducts,
  getMarketplaceProductVariants,
  removeMarketplaceCartItem,
  updateMarketplaceCartItem,
} from "@/services/api";
import type {
  MarketplaceCartResponse,
  MarketplaceCustomerDetailResponse,
  MarketplaceCustomerListResponse,
  MarketplaceProductListResponse,
  MarketplaceProductResponse,
  MarketplaceProductVariantsResponse,
} from "@/types/api/marketplace";

export type MarketplaceProductParams = {
  q?: string;
  include_hidden?: boolean;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "price_asc" | "price_desc";
};

const MARKETPLACE_QUERY_STALE_MS = 15_000;
const MARKETPLACE_CART_STALE_MS = 3_000;

export function useMarketplaceProducts(params?: MarketplaceProductParams) {
  const normalizedParams = {
    ...params,
    include_hidden: params?.include_hidden ?? false,
  };

  return useQuery({
    queryKey: QK.marketplace.list(normalizedParams ?? {}),
    queryFn: async (): Promise<MarketplaceProductListResponse> =>
      ensureMarketplaceSuccess(await getMarketplaceProducts(normalizedParams)),
    retry: false,
    staleTime: MARKETPLACE_QUERY_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceProductDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: QK.marketplace.detail(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceProductResponse> =>
      ensureMarketplaceSuccess(await getMarketplaceProductDetail(id as string | number)),
    retry: false,
    staleTime: MARKETPLACE_QUERY_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceProductVariants(id: string | number | undefined) {
  return useQuery({
    queryKey: QK.marketplace.variants(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceProductVariantsResponse> =>
      ensureMarketplaceSuccess(await getMarketplaceProductVariants(id as string | number)),
    retry: false,
    staleTime: MARKETPLACE_QUERY_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.marketplace.cart(),
    queryFn: async (): Promise<MarketplaceCartResponse> =>
      ensureMarketplaceSuccess(await getMarketplaceCart()),
    enabled: options?.enabled ?? true,
    retry: false,
    staleTime: MARKETPLACE_CART_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export type MarketplaceCustomerParams = {
  q?: string;
  status?: string;
  min_orders?: number;
  max_orders?: number;
  limit?: number;
  offset?: number;
  sort?: "newest" | "oldest" | "orders_desc" | "spend_desc" | "spend_asc";
};

export function useMarketplaceCustomers(params?: MarketplaceCustomerParams) {
  return useQuery({
    queryKey: QK.marketplace.customers(params ?? {}),
    queryFn: async (): Promise<MarketplaceCustomerListResponse> =>
      ensureMarketplaceSuccess(await listMarketplaceCustomers(params)),
    retry: false,
    staleTime: MARKETPLACE_QUERY_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useMarketplaceCustomerDetail(id?: string | number) {
  return useQuery({
    queryKey: QK.marketplace.customerDetail(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceCustomerDetailResponse> =>
      ensureMarketplaceSuccess(await getMarketplaceCustomerDetail(id as string | number)),
    retry: false,
    staleTime: MARKETPLACE_QUERY_STALE_MS,
    refetchOnWindowFocus: false,
  });
}

export function useCartMutations() {
  const qc = useQueryClient();

  const refreshMarketplaceState = async () => {
    await qc.invalidateQueries({ queryKey: QK.marketplace.cart() });
  };

  const addItem = useMutation({
    mutationFn: (payload: {
      product_id: number;
      quantity: number;
      variant_group_id?: number;
      variant_option_id?: number;
    }) =>
      addMarketplaceCartItem(payload).then(ensureMarketplaceSuccess),
    onSuccess: refreshMarketplaceState,
    onError: refreshMarketplaceState,
  });

  const updateItem = useMutation({
    mutationFn: (payload: { itemId: number; quantity: number }) =>
      updateMarketplaceCartItem(payload.itemId, {
        quantity: payload.quantity,
      }).then(ensureMarketplaceSuccess),
    onSuccess: refreshMarketplaceState,
    onError: refreshMarketplaceState,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: number) =>
      removeMarketplaceCartItem(itemId).then(ensureMarketplaceSuccess),
    onSuccess: refreshMarketplaceState,
    onError: refreshMarketplaceState,
  });

  return { addItem, updateItem, removeItem };
}
