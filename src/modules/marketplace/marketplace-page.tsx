/** @format */

"use client";

import { useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { MarketplaceHeader } from "./components/header";
import { FiltersSidebar } from "./components/filters-sidebar";
import { ProductsSection } from "./components/products-section";
import { CART_BADGE } from "./constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  const handleSubmitSearch = () => setSubmittedSearch(search.trim());

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MarketplaceHeader
              searchValue={search}
              onSearchChange={setSearch}
              onSubmit={handleSubmitSearch}
            />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FiltersSidebar />
              </div>
              <ProductsSection search={submittedSearch} />
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
