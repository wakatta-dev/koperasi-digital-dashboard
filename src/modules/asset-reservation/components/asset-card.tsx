/** @format */

import Link from "next/link";
import Image from "next/image";

import type { AssetItem } from "../types";

const STATUS_STYLES: Record<
  AssetItem["status"],
  { label: string; className: string }
> = {
  available: { label: "Tersedia", className: "bg-green-500" },
  rented: { label: "Disewa", className: "bg-red-500" },
  maintenance: { label: "Perawatan", className: "bg-yellow-500" },
};

type AssetCardProps = {
  asset: AssetItem;
};

export function AssetCard({ asset }: AssetCardProps) {
  const statusStyle = STATUS_STYLES[asset.status];
  const hasImage = Boolean(asset.imageUrl);

  return (
    <Link
      href={`/penyewaan-aset/${asset.id}`}
      className="bg-white dark:bg-surface-card-dark rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col group"
    >
      <div className="relative h-48 overflow-hidden">
        {hasImage ? (
          <Image
            src={asset.imageUrl}
            alt={asset.title}
            fill
            sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400 dark:bg-gray-800 dark:text-gray-500">
            Tidak ada foto
          </div>
        )}
        <div
          className={`${statusStyle.className} absolute top-3 right-3 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide`}
        >
          {statusStyle.label}
        </div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {asset.category}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-brand-primary transition">
          {asset.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {asset.description}
        </p>
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Harga Sewa
            </span>
            <span className="text-brand-primary font-bold text-base">
              {asset.price}
              <span className="text-xs text-gray-500 font-normal">
                {asset.unit}
              </span>
            </span>
          </div>
          <span className="p-2 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 group-hover:bg-brand-primary group-hover:text-white transition">
            <span className="material-icons-outlined text-xl">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}
