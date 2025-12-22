/** @format */

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "@/hooks/queries/queryKeys";
import {
  addMarketplaceCartItem,
  getMarketplaceCart,
  getMarketplaceProductDetail,
  getMarketplaceProducts,
  removeMarketplaceCartItem,
  updateMarketplaceCartItem,
} from "@/services/api";
import type {
  MarketplaceCartResponse,
  MarketplaceProductListResponse,
  MarketplaceProductResponse,
} from "@/types/api/marketplace";

export type MarketplaceProductParams = {
  q?: string;
  include_hidden?: boolean;
  min_price?: number;
  max_price?: number;
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

export function useMarketplaceCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.marketplace.cart(),
    queryFn: async (): Promise<MarketplaceCartResponse> =>
      ensureSuccess(await getMarketplaceCart()),
    enabled: options?.enabled ?? true,
  });
}

export function useCartMutations() {
  const qc = useQueryClient();

  const refreshCart = () => qc.invalidateQueries({ queryKey: QK.marketplace.cart() });

  const addItem = useMutation({
    mutationFn: (payload: { product_id: number; quantity: number }) =>
      addMarketplaceCartItem(payload).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  const updateItem = useMutation({
    mutationFn: (payload: { itemId: number; quantity: number }) =>
      updateMarketplaceCartItem(payload.itemId, { quantity: payload.quantity }).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  const removeItem = useMutation({
    mutationFn: (itemId: number) => removeMarketplaceCartItem(itemId).then(ensureSuccess),
    onSuccess: refreshCart,
  });

  return { addItem, updateItem, removeItem };
}
