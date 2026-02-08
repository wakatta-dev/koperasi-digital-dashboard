/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";

import { QK } from "@/hooks/queries/queryKeys";
import { getAssetMasterData } from "@/services/api/assets";
import type { AssetMasterDataCollection } from "@/types/api/asset-rental";

function sortByOrderThenValue<T extends { sort_order: number; value: string }>(items: T[]) {
  return items
    .slice()
    .sort((a, b) => a.sort_order - b.sort_order || a.value.localeCompare(b.value));
}

export function toFormOptionGroups(collection?: AssetMasterDataCollection) {
  if (!collection) {
    return {
      categories: [] as string[],
      statuses: [] as string[],
      locations: [] as string[],
    };
  }

  const categories = sortByOrderThenValue(collection.categories)
    .filter((item) => item.is_active)
    .map((item) => item.value);

  const statuses = sortByOrderThenValue(collection.statuses)
    .filter((item) => item.is_active)
    .map((item) => item.value);

  const locations = sortByOrderThenValue(collection.locations)
    .filter((item) => item.is_active)
    .map((item) => item.value);

  return {
    categories,
    statuses,
    locations,
  };
}

export function useAssetMasterData() {
  return useQuery({
    queryKey: QK.assetRental.masterData(),
    queryFn: async () => {
      const response = await getAssetMasterData();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat master data aset");
      }
      return response.data;
    },
  });
}
