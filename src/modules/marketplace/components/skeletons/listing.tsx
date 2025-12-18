/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { Skeleton } from "@/components/ui/skeleton";
import { CART_BADGE } from "../../constants";
import { LandingNavbar } from "@/modules/landing/components/navbar";
import { LandingFooter } from "@/modules/landing/components/footer";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function FilterCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-3">
      <Skeleton className="h-5 w-24 bg-gray-200 dark:bg-gray-800" />
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full bg-gray-200 dark:bg-gray-800" />
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <Skeleton className="h-3 w-16 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-5 w-40 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-3 w-10 bg-gray-200 dark:bg-gray-800" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-full bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-9 w-12 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceListingSkeleton() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar
          activeLabel="Marketplace"
          showCart
          cartCount={CART_BADGE}
        />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-4 w-80 bg-gray-200 dark:bg-gray-800" />
              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                <Skeleton className="h-11 w-full bg-gray-200 dark:bg-gray-800" />
                <div className="flex gap-2">
                  <Skeleton className="h-11 w-48 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-11 w-20 bg-gray-200 dark:bg-gray-800" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <FilterCardSkeleton />
                <FilterCardSkeleton />
                <FilterCardSkeleton />
              </div>
              <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-9 w-32 bg-gray-200 dark:bg-gray-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, idx) => (
                    <ProductCardSkeleton key={idx} />
                  ))}
                </div>
                <div className="mt-12 flex justify-center gap-2">
                  {[...Array(5)].map((_, idx) => (
                    <Skeleton
                      key={idx}
                      className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-800"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
