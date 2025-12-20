/** @format */

import Link from "next/link";

import React, { useMemo } from "react";
import { useAssetList } from "../../hooks";
import type { AssetItem } from "../../types";
import { AssetCard } from "../../components/asset-card";

type DetailRecommendationsProps = {
  currentId?: string;
};

export function DetailRecommendations({ currentId }: DetailRecommendationsProps) {
  const { data, isLoading } = useAssetList();
  const items: AssetItem[] = useMemo(() => {
    if (!data) return [];
    return data
      .map(mapAsset)
      .filter((asset) => asset && String(asset.id) !== currentId)
      .slice(0, 3) as AssetItem[];
  }, [data, currentId]);

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Aset Lain Yang Mungkin Anda Suka
        </h2>
        <Link
          href="/penyewaan-aset"
          className="text-[#4338ca] font-semibold hover:text-indigo-600 flex items-center gap-1 text-sm"
        >
          Lihat Semua <span className="material-icons-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="h-64 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] animate-pulse"
              />
            ))
          : items.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
      </div>
    </div>
  );
}

function mapAsset(asset: any): AssetItem {
  if (!asset) return null as any;
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const status: AssetItem["status"] =
    (asset.status || "").toLowerCase() === "archived" ? "maintenance" : "available";
  return {
    id: String(asset.id),
    category: rateType === "hourly" ? "Per Jam" : "Per Hari",
    title: asset.name || "",
    description: asset.description || "",
    price: `Rp${(asset.rate_amount ?? 0).toLocaleString("id-ID")}`,
    unit,
    status,
    imageUrl: asset.photo_url || "",
    rawPrice: asset.rate_amount ?? 0,
  };
}
