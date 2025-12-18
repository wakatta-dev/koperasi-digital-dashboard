/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { MarketplaceHeader } from "./components/header";
import { MarketplaceNavbar } from "./components/navbar";
import { FiltersSidebar } from "./components/filters-sidebar";
import { ProductsSection } from "./components/products-section";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplacePage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <MarketplaceNavbar />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <MarketplaceHeader />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <FiltersSidebar />
              </div>
              <ProductsSection />
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
