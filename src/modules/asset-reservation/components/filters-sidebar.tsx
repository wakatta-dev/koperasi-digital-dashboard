/** @format */

import { Checkbox } from "@/components/ui/checkbox";
import { FilterPanel } from "@/components/shared/filters/FilterPanel";
import { FilterSection } from "@/components/shared/filters/FilterSection";
import { ASSET_CATEGORIES } from "../constants";

type AssetFiltersSidebarProps = {
  selectedCategory?: string;
  onCategoryChange?: (value?: string) => void;
  onReset?: () => void;
};

export function AssetFiltersSidebar({
  selectedCategory,
  onCategoryChange,
  onReset,
}: AssetFiltersSidebarProps) {
  return (
    <FilterPanel className="p-6 pb-4 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
          Filter
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-[#4338ca] font-medium hover:underline"
        >
          Reset
        </button>
      </div>

      <FilterSection
        title="Kategori Aset"
        className="space-y-2"
        titleClassName="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
      >
        {ASSET_CATEGORIES.map((category) => (
          <label
            key={category}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <Checkbox
              checked={selectedCategory === category}
              className="h-4 w-4 border-gray-300 dark:border-gray-600 data-[state=checked]:bg-[#4338ca] data-[state=checked]:border-[#4338ca]"
              onCheckedChange={(checked) =>
                onCategoryChange?.(checked ? category : undefined)
              }
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#4338ca] transition">
              {category}
            </span>
          </label>
        ))}
      </FilterSection>
    </FilterPanel>
  );
}
