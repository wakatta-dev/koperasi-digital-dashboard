/** @format */

import { useQuery } from "@tanstack/react-query";

import { QK } from "@/hooks/queries/queryKeys";
import { getAssetById, getAssetAvailability } from "@/services/api/assets";
import type { AssetAvailabilityResponse } from "@/types/api/asset";

export function useAssetDetail(assetId?: string | number) {
  return useQuery({
    enabled: Boolean(assetId),
    queryKey: QK.assetRental.detail(assetId ?? "unknown"),
    queryFn: async (): Promise<any> => {
      const res = await getAssetById(assetId ?? "");
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat detail aset");
      }
      return res.data;
    },
  });
}

export function useAssetAvailability(
  assetId?: string | number,
  params?: { start_date?: string; end_date?: string }
) {
  return useQuery({
    enabled: Boolean(assetId),
    queryKey: [
      "asset-rental",
      "assets",
      "availability",
      assetId ?? "unknown",
      params?.start_date,
      params?.end_date,
    ],
    queryFn: async (): Promise<AssetAvailabilityResponse> => {
      const res = await getAssetAvailability(assetId ?? "", params);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat ketersediaan aset");
      }
      return res.data;
    },
  });
}
