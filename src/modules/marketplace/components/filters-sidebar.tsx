/** @format */

import type { ReactNode } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CATEGORY_FILTERS, PRODUCER_FILTERS } from "../constants";

export function FiltersSidebar() {
  return (
    <div className="space-y-6">
      <FilterCard title="Kategori" withChevron>
        <div className="space-y-3">
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
        </div>
      </FilterCard>

      <FilterCard title="Rentang Harga">
        <div className="space-y-4">
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
          <button className="w-full py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded transition">
            Terapkan
          </button>
        </div>
      </FilterCard>

      <FilterCard title="Produsen">
        <div className="space-y-3">
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
        </div>
      </FilterCard>
    </div>
  );
}

function FilterCard({
  title,
  children,
  withChevron = false,
}: {
  title: string;
  children: ReactNode;
  withChevron?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
        {title}
        {withChevron ? (
          <span className="material-icons-outlined text-gray-400 text-sm">expand_less</span>
        ) : null}
      </h3>
      {children}
    </div>
  );
}
