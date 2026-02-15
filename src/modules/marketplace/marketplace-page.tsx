/** @format */

"use client";

import { useState } from "react";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { MarketplaceHeader } from "./components/layout/header";
import { FiltersSidebar } from "./components/filters/filters-sidebar";
import { ProductsSection } from "./components/product/products-section";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { DEFAULT_MARKETPLACE_FILTERS, type MarketplaceFilters } from "./types";

export function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [filtersDraft, setFiltersDraft] = useState<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);
  const [filters, setFilters] = useState<MarketplaceFilters>(DEFAULT_MARKETPLACE_FILTERS);
  const { data: cart } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;

  const handleSubmitSearch = () => setSubmittedSearch(search.trim());
  const handleApplyFilters = () => {
    setFilters({
      ...filtersDraft,
      categories: filtersDraft.categories.length ? filtersDraft.categories : ["all"],
      producer: filtersDraft.producer ?? "all",
    });
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar
        activeLabel="Marketplace"
        showCart
        cartCount={cartCount}
      />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MarketplaceHeader
            searchValue={search}
            onSearchChange={setSearch}
            onSubmit={handleSubmitSearch}
          />
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <FiltersSidebar
                filters={filtersDraft}
                onChange={setFiltersDraft}
                onApply={handleApplyFilters}
              />
            </div>
            <ProductsSection search={submittedSearch} filters={filters} />
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
