/** @format */

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { QK } from "@/hooks/queries/queryKeys";
import { getAssets } from "@/services/api/assets";
import type { AssetFilterQuery } from "@/types/api/asset";
import type { Pagination } from "@/types/api/common";
import type { AssetRentalAsset } from "@/types/api/asset-rental";

const DEFAULT_PAGE_SIZE = 9;
const MAX_PAGE_SIZE = 50;

export type AssetListResult = {
  items: AssetRentalAsset[];
  pagination?: Pagination;
};

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
  const limit = Number(filters.limit ?? DEFAULT_PAGE_SIZE);
  if (!Number.isNaN(limit) && limit > 0) {
    result.limit = Math.min(limit, MAX_PAGE_SIZE);
  }
  if (filters.cursor !== undefined && filters.cursor !== null) {
    const cursor = Number(filters.cursor);
    if (!Number.isNaN(cursor) && cursor >= 0) {
      result.cursor = cursor;
    }
  }
  return result;
}

export function useAssetList(filters: AssetFilterQuery = {}) {
  const params = useMemo(() => sanitizeFilters(filters), [filters]);

  return useQuery({
    queryKey: QK.assetRental.list(params),
    queryFn: async (): Promise<AssetListResult> => {
      const res = await getAssets(params);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat aset");
      }
      return { items: res.data, pagination: res.meta?.pagination };
    },
    keepPreviousData: true,
  });
}
