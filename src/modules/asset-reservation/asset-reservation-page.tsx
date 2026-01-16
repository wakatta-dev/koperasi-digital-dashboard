/** @format */
"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetGrid } from "./components/asset-grid";
import { AssetHeroSection } from "./components/hero-section";
import { AssetFiltersSidebar } from "./components/filters-sidebar";
import { AssetReservationFooter } from "./components/reservation-footer";
import { useMemo, useState, useEffect } from "react";
import type { AssetFilterQuery } from "@/types/api/asset";
import { SORT_OPTIONS } from "./constants";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const PAGE_SIZE = 9;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];
const DEFAULT_SORT: SortValue = SORT_OPTIONS[0].value;
const resolveSortParam = (value: string | null): SortValue =>
  SORT_OPTIONS.some((option) => option.value === value)
    ? (value as SortValue)
    : DEFAULT_SORT;

export function AssetReservationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") ?? "";
  const initialCategory = searchParams.get("category") ?? "";
  const initialSort = resolveSortParam(searchParams.get("sort"));
  const initialCursor = searchParams.get("cursor") ?? undefined;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filters, setFilters] = useState<AssetFilterQuery>({
    sort: initialSort,
    category: initialCategory || undefined,
    search: initialSearch || undefined,
  });
  const [pageCursor, setPageCursor] = useState<string | number | undefined>(
    initialCursor
  );

  useEffect(() => {
    const search = searchParams.get("search") ?? "";
    const category = searchParams.get("category") ?? "";
    const sort = resolveSortParam(searchParams.get("sort"));
    const cursor = searchParams.get("cursor") ?? undefined;

    setSearchTerm(search);
    setFilters({
      sort,
      category: category || undefined,
      search: search || undefined,
    });
    setPageCursor(cursor || undefined);
  }, [searchParams]);

  const updateParams = (updates: {
    search?: string;
    category?: string;
    sort?: string;
    cursor?: string | number;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const setOrDelete = (key: string, value?: string | number) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
        return;
      }
      params.set(key, String(value));
    };

    setOrDelete("search", updates.search);
    setOrDelete("category", updates.category);
    setOrDelete("sort", updates.sort);
    setOrDelete("cursor", updates.cursor);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearchSubmit = () => {
    const nextSearch = searchTerm.trim();
    setFilters((prev) => ({
      ...prev,
      search: nextSearch || undefined,
    }));
    setPageCursor(undefined);
    updateParams({ search: nextSearch || undefined, cursor: undefined });
  };

  const handleCategoryChange = (value?: string) => {
    setFilters((prev) => ({
      ...prev,
      category: value,
    }));
    setPageCursor(undefined);
    updateParams({ category: value, cursor: undefined });
  };

  const handleSortChange = (sort: AssetFilterQuery["sort"]) => {
    setFilters((prev) => ({
      ...prev,
      sort,
    }));
    setPageCursor(undefined);
    updateParams({ sort, cursor: undefined });
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilters({ sort: DEFAULT_SORT });
    setPageCursor(undefined);
    updateParams({
      search: undefined,
      category: undefined,
      sort: DEFAULT_SORT,
      cursor: undefined,
    });
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
                onPageChange={(cursor) => {
                  setPageCursor(cursor);
                  updateParams({ cursor });
                }}
              />
            </div>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
