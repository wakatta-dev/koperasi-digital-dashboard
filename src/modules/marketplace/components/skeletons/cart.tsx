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

function StepSkeleton() {
  return (
    <div className="relative flex flex-col items-center z-10 group cursor-default">
      <Skeleton className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-800" />
      <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800 mt-2" />
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
      <Skeleton className="w-full sm:w-32 h-32 rounded-xl bg-gray-200 dark:bg-gray-800" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-64 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-4 w-40 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-4 w-28 bg-gray-200 dark:bg-gray-800" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-28 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-5 w-20 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceCartSkeleton() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-800" />
            <div className="w-full max-w-4xl mx-auto mb-8 pt-2">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
                {[...Array(4)].map((_, idx) => (
                  <StepSkeleton key={idx} />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                    <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-gray-800" />
                    <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <CartItemSkeleton />
                  <CartItemSkeleton />
                </div>
                <Skeleton className="h-4 w-44 bg-gray-200 dark:bg-gray-800" />
              </div>
              <div className="lg:col-span-4">
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                  <Skeleton className="h-5 w-40 bg-gray-200 dark:bg-gray-800" />
                  {[...Array(4)].map((_, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-gray-800" />
                      <Skeleton className="h-4 w-20 bg-gray-200 dark:bg-gray-800" />
                    </div>
                  ))}
                  <Skeleton className="h-6 w-48 bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
                  <Skeleton className="h-10 w-full bg-gray-200 dark:bg-gray-800" />
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
