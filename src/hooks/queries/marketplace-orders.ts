/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import {
  getMarketplaceOrderDetail,
  listMarketplaceOrders,
  updateMarketplaceOrderStatus,
} from "@/services/api";
import type {
  MarketplaceOrderDetailResponse,
  MarketplaceOrderListResponse,
  MarketplaceOrderStatusUpdateRequest,
} from "@/types/api/marketplace";

export type MarketplaceOrderListParams = {
  q?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  sort?: string;
};

export function useMarketplaceOrders(
  params?: MarketplaceOrderListParams,
  options?: { enabled?: boolean }
) {
  const normalized = {
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    ...params,
  };

  return useQuery({
    queryKey: QK.marketplace.orders(normalized),
    queryFn: async (): Promise<MarketplaceOrderListResponse> =>
      ensureSuccess(await listMarketplaceOrders(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
  });
}

export function useMarketplaceOrder(
  id?: string | number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.marketplace.orderDetail(id ?? ""),
    enabled: Boolean(id) && (options?.enabled ?? true),
    queryFn: async (): Promise<MarketplaceOrderDetailResponse> =>
      ensureSuccess(await getMarketplaceOrderDetail(id as string | number)),
  });
}

export function useMarketplaceOrderActions() {
  const qc = useQueryClient();
  const invalidateLists = () =>
    qc.invalidateQueries({
      queryKey: QK.marketplace.orders(),
    });
  const invalidateDetail = (id: string | number | undefined) => {
    if (!id) return;
    qc.invalidateQueries({
      queryKey: QK.marketplace.orderDetail(id),
    });
  };

  const updateStatus = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: MarketplaceOrderStatusUpdateRequest;
    }) => ensureSuccess(await updateMarketplaceOrderStatus(vars.id, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateLists();
      invalidateDetail(vars.id);
      toast.success("Status pesanan diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui status pesanan"),
  });

  return {
    updateStatus,
  } as const;
}
