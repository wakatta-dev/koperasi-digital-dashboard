/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterActions } from "@/components/shared/filters/FilterActions";
import { FilterPanel } from "@/components/shared/filters/FilterPanel";
import { FilterSection } from "@/components/shared/filters/FilterSection";
import type { MarketplaceFilters } from "../../types";

type Props = {
  filters: MarketplaceFilters;
  onChange: (next: MarketplaceFilters) => void;
  onApply: () => void;
};

export function FiltersSidebar({ filters, onChange, onApply }: Props) {
  const updatePrice = (key: "priceMin" | "priceMax", raw: string) => {
    const value = raw === "" ? undefined : Number(raw);
    onChange({ ...filters, [key]: Number.isNaN(value) ? undefined : value });
  };

  return (
    <FilterPanel className="space-y-6 p-6">
      <FilterSection title="Rentang Harga" withDivider className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rp</span>
          <Input
            type="number"
            placeholder="Min"
            value={filters.priceMin ?? ""}
            onChange={(e) => updatePrice("priceMin", e.target.value)}
            className="w-full text-sm rounded h-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rp</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.priceMax ?? ""}
            onChange={(e) => updatePrice("priceMax", e.target.value)}
            className="w-full text-sm rounded h-10"
          />
        </div>
        <FilterActions className="pt-0 border-0 justify-start">
          <Button
            type="button"
            onClick={onApply}
            variant="outline"
            className="w-full py-2 bg-muted hover:bg-muted/80 text-foreground text-sm font-medium rounded transition border-border"
          >
            Terapkan
          </Button>
        </FilterActions>
      </FilterSection>
    </FilterPanel>
  );
}
