/** @format */

"use client";

import { Badge } from "@/components/ui/badge";

export type SelectedAssetSummary = {
  title: string;
  statusLabel: string;
  statusTone?: "available" | "busy" | "maintenance";
  priceLabel: string;
  unitLabel: string;
  imageUrl: string;
  capacityLabel: string;
  facilitiesLabel: string;
  locationLabel: string;
};

type SelectedAssetSummaryCardProps = Readonly<{
  asset: SelectedAssetSummary;
}>;

function statusBadgeClasses(tone?: SelectedAssetSummary["statusTone"]) {
  switch (tone) {
    case "busy":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    case "maintenance":
      return "bg-gray-200 text-gray-700 dark:bg-gray-700/60 dark:text-gray-200";
    case "available":
    default:
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }
}

export function SelectedAssetSummaryCard({ asset }: SelectedAssetSummaryCardProps) {
  return (
    <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Aset yang Dipilih
      </h3>

      <div className="flex gap-4 mb-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={asset.title}
            className="w-full h-full object-cover"
            src={asset.imageUrl}
          />
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
            {asset.title}
          </h4>
          <Badge
            className={`text-xs font-medium px-2 py-0.5 rounded-full mb-2 inline-block ${statusBadgeClasses(
              asset.statusTone
            )}`}
          >
            {asset.statusLabel}
          </Badge>
          <p className="text-sm font-semibold text-brand-primary">
            {asset.priceLabel}{" "}
            <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
              {asset.unitLabel}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Kapasitas</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {asset.capacityLabel}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Fasilitas</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {asset.facilitiesLabel}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500 dark:text-gray-400">Lokasi</span>
          <span className="font-medium text-gray-900 dark:text-white text-right">
            {asset.locationLabel}
          </span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl flex-shrink-0">
            info
          </span>
          <div>
            <h5 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">
              Catatan Penting
            </h5>
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Pengajuan sewa akan diproses oleh admin BUMDes. Konfirmasi
              ketersediaan dan total biaya akan dikirimkan melalui WhatsApp/Email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

