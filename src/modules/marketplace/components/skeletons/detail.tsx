/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/modules/landing/components/navbar";
import { CART_BADGE } from "../../constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceDetailSkeleton() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Skeleton className="h-4 w-80 bg-gray-200 dark:bg-gray-800" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5 space-y-4">
                <Skeleton className="h-[420px] w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, idx) => (
                    <Skeleton key={idx} className="aspect-square w-full rounded-xl bg-gray-200 dark:bg-gray-800" />
                  ))}
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-8 w-3/4 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-6 w-40 bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-4 w-5/6 bg-gray-200 dark:bg-gray-800" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-800" />
                </div>
                <Skeleton className="h-12 w-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-10 w-64 bg-gray-200 dark:bg-gray-800" />
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="h-20 w-full bg-gray-200 dark:bg-gray-800" />
                ))}
              </div>
              <div className="space-y-4">
                <Skeleton className="h-64 w-full bg-gray-200 dark:bg-gray-800" />
                <Skeleton className="h-32 w-full bg-gray-200 dark:bg-gray-800" />
              </div>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
