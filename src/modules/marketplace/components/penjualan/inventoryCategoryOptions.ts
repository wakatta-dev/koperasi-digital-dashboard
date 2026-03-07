/** @format */

import type { InventoryCategoryResponse } from "@/types/api/inventory";

export function selectableInventoryCategoryNames(
  categories: InventoryCategoryResponse[] | undefined,
  currentCategory?: string
) {
  const labels = new Set<string>();

  (categories ?? []).forEach((item) => {
    if (!item.is_active || !item.name) {
      return;
    }
    labels.add(item.name);
  });

  if (currentCategory?.trim()) {
    labels.add(currentCategory.trim());
  }

  return Array.from(labels);
}
