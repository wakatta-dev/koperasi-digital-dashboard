/** @format */

import Link from "next/link";

import { AssetCard } from "../../components/asset-card";
import { getRecommendedAssets } from "../constants";

type DetailRecommendationsProps = {
  currentId?: string;
};

export function DetailRecommendations({ currentId }: DetailRecommendationsProps) {
  const items = getRecommendedAssets(currentId);

  return (
    <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Aset Lain Yang Mungkin Anda Suka
        </h2>
        <Link
          href="/penyewaan-asset"
          className="text-[#4338ca] font-semibold hover:text-indigo-600 flex items-center gap-1 text-sm"
        >
          Lihat Semua <span className="material-icons-outlined text-lg">arrow_forward</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    </div>
  );
}
