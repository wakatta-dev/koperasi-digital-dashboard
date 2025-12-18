/** @format */

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ASSET_CATEGORIES } from "../constants";

export function AssetFiltersSidebar() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl p-6 border border-gray-200 dark:border-gray-700 sticky top-24 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">Filter</h3>
        <button type="button" className="text-xs text-[#4338ca] font-medium hover:underline">
          Reset
        </button>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Kategori Aset</h4>
        <div className="space-y-2">
          {ASSET_CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox className="h-4 w-4 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[#4338ca] data-[state=checked]:border-[#4338ca]" />
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#4338ca] transition">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Rentang Harga</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rp</span>
            <Input
              type="number"
              placeholder="Min"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 py-1.5 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Rp</span>
            <Input
              type="number"
              placeholder="Max"
              className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 py-1.5 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Tanggal Sewa</h4>
        <Input
          type="date"
          className="w-full text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 py-2 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca] text-gray-600 dark:text-gray-300"
        />
      </div>

      <Button className="w-full bg-[#4338ca]/10 hover:bg-[#4338ca]/20 text-[#4338ca] font-semibold py-2 rounded-lg text-sm transition border border-transparent">
        Terapkan Filter
      </Button>
    </div>
  );
}
