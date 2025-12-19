/** @format */
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SORT_OPTIONS } from "../constants";
import { AssetCard } from "./asset-card";
import { useMemo } from "react";
import type { AssetFilterQuery } from "@/types/api/asset";
import type { AssetItem } from "../types";
import { useAssetList } from "../hooks";

type AssetGridProps = {
  filters: AssetFilterQuery;
  onSortChange: (value: AssetFilterQuery["sort"]) => void;
};

export function AssetGrid({ filters, onSortChange }: AssetGridProps) {
  const { data, isLoading, error } = useAssetList(filters);
  const assets: AssetItem[] = useMemo(() => {
    if (!data) return [];
    return data.map(mapAsset);
  }, [data]);

  const countText = useMemo(() => {
    if (isLoading) return "Memuat aset...";
    return `${assets.length} aset`;
  }, [isLoading, assets.length]);

  return (
    <div className="flex-grow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {countText}
          </span>{" "}
          tersedia
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Urutkan:
          </span>
          <Select
            value={filters.sort ?? SORT_OPTIONS[0].value}
            onValueChange={(val) => onSortChange(val as AssetFilterQuery["sort"])}
          >
            <SelectTrigger className="text-sm border-none bg-transparent font-semibold text-gray-900 dark:text-white focus:ring-0 focus-visible:ring-0 focus-visible:border-none px-0 h-10">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <div className="mb-4 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          {error instanceof Error ? error.message : "Gagal memuat aset"}
        </div>
      ) : null}

      {isLoading ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">Memuat aset...</div>
      ) : null}

      {!isLoading && assets.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Tidak ada aset yang sesuai dengan filter.
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-2">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          disabled
        >
          <span className="material-icons-outlined text-lg">chevron_left</span>
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4338ca] text-white font-medium shadow-lg shadow-indigo-500/30"
        >
          1
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
        >
          2
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium"
        >
          3
        </button>
        <span className="px-2 text-gray-400">...</span>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="material-icons-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  );
}

function mapAsset(asset: any): AssetItem {
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const status: AssetItem["status"] =
    (asset.status || "").toLowerCase() === "archived" ? "maintenance" : "available";
  return {
    id: String(asset.id),
    category: rateType === "hourly" ? "Per Jam" : "Per Hari",
    title: asset.name,
    description: asset.description || "Aset tersedia untuk disewa.",
    price: `Rp${(asset.rate_amount ?? 0).toLocaleString("id-ID")}`,
    unit,
    status,
    imageUrl:
      asset.photo_url ||
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=60",
  };
}
