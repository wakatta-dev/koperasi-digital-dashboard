/** @format */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { QK } from "@/hooks/queries/queryKeys";
import { getAssets } from "@/services/api/assets";
import type { AssetFilterQuery } from "@/types/api/asset";
import type { AssetRentalAsset } from "@/types/api/asset-rental";

function sanitizeFilters(filters: AssetFilterQuery = {}): AssetFilterQuery {
  const result: AssetFilterQuery = {};
  if (filters.category?.trim()) result.category = filters.category.trim();
  if (filters.status?.trim()) result.status = filters.status.trim() as any;
  const searchValue = filters.search?.trim() || "";
  if (filters.category && !searchValue) {
    result.search = filters.category.trim();
  } else if (searchValue) {
    result.search = filters.category ? `${searchValue} ${filters.category}`.trim() : searchValue;
  }
  if (filters.sort?.trim()) result.sort = filters.sort.trim() as any;
  return result;
}

export function useAssetList(filters: AssetFilterQuery = {}) {
  const params = useMemo(() => sanitizeFilters(filters), [filters]);

  return useQuery({
    queryKey: QK.assetRental.list(params),
    queryFn: async (): Promise<AssetRentalAsset[]> => {
      const res = await getAssets(params);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat aset");
      }
      return res.data;
    },
  });
}
