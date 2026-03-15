/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import {
  getPartnerManagementSeller,
  listPartnerManagementSellers,
} from "@/services/api";
import type {
  PartnerManagementSellerItem,
  PartnerManagementSellerListResponse,
} from "@/types/api/partner-management";

export function usePartnerManagementSellers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.partnerManagement.sellers(),
    enabled: options?.enabled ?? true,
    queryFn: async (): Promise<PartnerManagementSellerListResponse> =>
      ensureSuccess(await listPartnerManagementSellers()),
  });
}

export function usePartnerManagementSeller(
  sellerId?: string | number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.partnerManagement.sellerDetail(sellerId ?? ""),
    enabled: Boolean(sellerId) && (options?.enabled ?? true),
    queryFn: async (): Promise<PartnerManagementSellerItem> =>
      ensureSuccess(await getPartnerManagementSeller(sellerId as string | number)),
  });
}
