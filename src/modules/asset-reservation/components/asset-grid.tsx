/** @format */

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ASSET_ITEMS, SORT_OPTIONS } from "../constants";
import { AssetCard } from "./asset-card";

export function AssetGrid() {
  return (
    <div className="flex-grow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">8 aset</span> tersedia
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Urutkan:</span>
          <Select defaultValue={SORT_OPTIONS[0]}>
            <SelectTrigger className="text-sm border-none bg-transparent font-semibold text-gray-900 dark:text-white focus:ring-0 focus-visible:ring-0 focus-visible:border-none px-0 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ASSET_ITEMS.map((asset) => (
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
