/** @format */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { GuestAssetCardItem } from "../../types";

type AssetQuickDetailPanelProps = Readonly<{
  item: GuestAssetCardItem;
  onClose?: () => void;
  applyHref: string;
}>;

export function AssetQuickDetailPanel({
  item,
  onClose,
  applyHref,
}: AssetQuickDetailPanelProps) {
  return (
    <div className="hidden lg:block w-1/3 xl:w-1/3 sticky top-28 h-[calc(100vh-140px)]">
      <div className="bg-white dark:bg-surface-card-dark rounded-[2rem] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col h-full relative">
        <div className="relative h-48 w-full">
          <img
            alt="Detail Asset"
            className="w-full h-full object-cover"
            src={item.imageUrl}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
          >
            <span className="material-icons-outlined text-sm">close</span>
          </button>
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-yellow-400 mb-1 text-xs font-bold">
              <span className="material-icons-outlined text-sm">star</span> 4.8
              (12)
            </div>
            <h2 className="text-xl font-bold text-white leading-tight">
              {item.title}
            </h2>
          </div>
        </div>
        <div className="p-6 flex-grow overflow-y-auto no-scrollbar">
          <div className="flex gap-2 mb-6">
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-800">
              {item.category}
            </span>
            <span className="px-3 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-lg text-xs font-bold border border-green-100 dark:border-green-800">
              {item.statusLabel}
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Deskripsi
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 block mb-1">
                  Kondisi
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sangat Baik
                </span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-400 block mb-1">Kode</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  AST-002
                </span>
              </div>
            </div>
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex-shrink-0 flex items-center justify-center text-brand-primary dark:text-indigo-300">
                  <span className="material-icons-outlined text-sm">info</span>
                </div>
                <div>
                  <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-200 mb-1">
                    Syarat Sewa
                  </h5>
                  <p className="text-[11px] text-indigo-700 dark:text-indigo-300/80 leading-snug">
                    Wajib KTP domisili desa untuk harga khusus. Pemakaian max
                    jam 22.00 WIB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-black/20">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Total Biaya
              </span>
              <div className="text-2xl font-extrabold text-brand-primary">
                {item.priceLabel}
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400 mb-1">
              {item.unitLabel}
            </span>
          </div>
          <Button
            asChild
            type="button"
            className="w-full py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
          >
            <Link href={applyHref}>
              Ajukan Sewa
              <span className="material-icons-outlined text-sm">
                calendar_month
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
