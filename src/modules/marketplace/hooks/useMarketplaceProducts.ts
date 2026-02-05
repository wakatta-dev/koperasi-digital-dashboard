/** @format */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import {
  addMarketplaceCartItem,
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

export function useMarketplaceProducts(params?: MarketplaceProductParams) {
  const normalizedParams = {
    ...params,
    include_hidden: params?.include_hidden ?? false,
  };

  return useQuery({
    queryKey: QK.marketplace.list(normalizedParams ?? {}),
    queryFn: async (): Promise<MarketplaceProductListResponse> =>
      ensureSuccess(await getMarketplaceProducts(normalizedParams)),
  });
}

export function useMarketplaceProductDetail(id: string | number | undefined) {
  return useQuery({
    queryKey: QK.marketplace.detail(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceProductResponse> =>
      ensureSuccess(await getMarketplaceProductDetail(id as string | number)),
  });
}

export function useMarketplaceProductVariants(id: string | number | undefined) {
  return useQuery({
    queryKey: QK.marketplace.variants(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceProductVariantsResponse> =>
      ensureSuccess(await getMarketplaceProductVariants(id as string | number)),
  });
}

export function useMarketplaceCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.marketplace.cart(),
    queryFn: async (): Promise<MarketplaceCartResponse> =>
      ensureSuccess(await getMarketplaceCart()),
    enabled: options?.enabled ?? true,
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
      ensureSuccess(await listMarketplaceCustomers(params)),
  });
}

export function useMarketplaceCustomerDetail(id?: string | number) {
  return useQuery({
    queryKey: QK.marketplace.customerDetail(id ?? ""),
    enabled: Boolean(id),
    queryFn: async (): Promise<MarketplaceCustomerDetailResponse> =>
      ensureSuccess(await getMarketplaceCustomerDetail(id as string | number)),
  });
}

export function useCartMutations() {
  const qc = useQueryClient();

  const refreshCart = () =>
    qc.invalidateQueries({ queryKey: QK.marketplace.cart() });

  const addItem = useMutation({
    mutationFn: (payload: {
      product_id: number;
      quantity: number;
      variant_group_id?: number;
      variant_option_id?: number;
    }) =>
      addMarketplaceCartItem(payload).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  const updateItem = useMutation({
    mutationFn: (payload: { itemId: number; quantity: number }) =>
      updateMarketplaceCartItem(payload.itemId, {
        quantity: payload.quantity,
      }).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: number) =>
      removeMarketplaceCartItem(itemId).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  return { addItem, updateItem, removeItem };
}
