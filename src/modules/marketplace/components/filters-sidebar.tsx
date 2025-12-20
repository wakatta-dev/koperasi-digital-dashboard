/** @format */

import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { FilterActions } from "@/components/shared/filters/FilterActions";
import { FilterPanel } from "@/components/shared/filters/FilterPanel";
import { FilterSection } from "@/components/shared/filters/FilterSection";
import { CATEGORY_FILTERS, PRODUCER_FILTERS } from "../constants";

export function FiltersSidebar() {
  return (
    <FilterPanel className="space-y-6 p-6">
      <FilterSection title="Kategori" withDivider>
        {CATEGORY_FILTERS.map((category) => (
          <label
            key={category.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              defaultChecked={category.defaultChecked}
              className="rounded text-[#4338ca] data-[state=checked]:bg-[#4338ca] data-[state=checked]:border-[#4338ca] border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-[#4338ca] transition">
              {category.label}
            </span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Rentang Harga" withDivider className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Rp</span>
          <Input
            type="number"
            placeholder="Min"
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-700 dark:text-gray-300 h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Rp</span>
          <Input
            type="number"
            placeholder="Max"
            className="w-full text-sm rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 text-gray-700 dark:text-gray-300 h-10"
          />
        </div>
        <FilterActions className="pt-0 border-0 justify-start">
          <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition">
            Terapkan
          </button>
        </FilterActions>
      </FilterSection>

      <FilterSection title="Produsen">
        {PRODUCER_FILTERS.map((producer) => (
          <label
            key={producer.value}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="producer"
              defaultChecked={producer.defaultChecked}
              className="text-[#4338ca] focus:ring-[#4338ca] border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 size-4"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-[#4338ca] transition">
              {producer.label}
            </span>
          </label>
        ))}
      </FilterSection>
    </FilterPanel>
  );
}
