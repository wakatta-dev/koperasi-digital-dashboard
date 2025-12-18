/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetGrid } from "./components/asset-grid";
import { AssetHeroSection } from "./components/hero-section";
import { AssetFiltersSidebar } from "./components/filters-sidebar";
import { AssetReservationFooter } from "./components/reservation-footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function AssetReservationPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <AssetHeroSection />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-64 flex-shrink-0 space-y-8">
                <AssetFiltersSidebar />
              </div>
              <AssetGrid />
            </div>
          </div>
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
