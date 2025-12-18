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

export function MarketplacePaymentSkeleton() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Skeleton className="h-4 w-80 bg-gray-200 dark:bg-gray-800" />
            <div className="w-full max-w-4xl mx-auto mb-8 pt-2">
              <div className="relative flex items-center justify-between">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-1 bg-[#4338ca] rounded-full z-0"></div>
                {[...Array(4)].map((_, idx) => (
                  <StepSkeleton key={idx} />
                ))}
              </div>
            </div>
            <Skeleton className="h-8 w-64 bg-gray-200 dark:bg-gray-800" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
              <div className="lg:col-span-8 space-y-6">
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                  <Skeleton className="h-5 w-48 bg-gray-200 dark:bg-gray-800" />
                  {[...Array(2)].map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  ))}
                </div>
                <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                  <Skeleton className="h-5 w-44 bg-gray-200 dark:bg-gray-800" />
                  {[...Array(2)].map((_, idx) => (
                    <Skeleton key={idx} className="h-16 w-full bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  ))}
                </div>
                <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-gray-800" />
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
                  <Skeleton className="h-11 w-full bg-gray-200 dark:bg-gray-800" />
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
