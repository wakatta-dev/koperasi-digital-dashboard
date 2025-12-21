/** @format */
"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetGrid } from "./components/asset-grid";
import { AssetHeroSection } from "./components/hero-section";
import { AssetFiltersSidebar } from "./components/filters-sidebar";
import { AssetReservationFooter } from "./components/reservation-footer";
import { useMemo, useState } from "react";
import type { AssetFilterQuery } from "@/types/api/asset";
import { SORT_OPTIONS } from "./constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const PAGE_SIZE = 9;

export function AssetReservationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AssetFilterQuery>({
    sort: SORT_OPTIONS[0].value,
  });
  const [pageCursor, setPageCursor] = useState<string | number | undefined>();

  const handleSearchSubmit = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchTerm.trim() || undefined,
    }));
    setPageCursor(undefined);
  };

  const handleCategoryChange = (value?: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
    }));
    setPageCursor(undefined);
  };

  const handleSortChange = (sort: AssetFilterQuery["sort"]) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }));
    setPageCursor(undefined);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ sort: SORT_OPTIONS[0].value });
    setPageCursor(undefined);
  };

  const appliedFilters = useMemo(() => filters, [filters]);

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <AssetHeroSection
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <AssetFiltersSidebar
                  selectedCategory={appliedFilters.category}
                  onCategoryChange={handleCategoryChange}
                  onReset={handleResetFilters}
                />
              </div>
              <AssetGrid
                filters={appliedFilters}
                onSortChange={handleSortChange}
                pageCursor={pageCursor}
                pageSize={PAGE_SIZE}
                onPageChange={setPageCursor}
              />
            </div>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
