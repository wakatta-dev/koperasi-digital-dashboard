/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/modules/landing/components/navbar";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceConfirmationSkeleton() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={0} />
        <main className="flex-grow pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center">
          <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="mx-auto flex items-center justify-center">
                <Skeleton className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-800" />
              </div>
              <Skeleton className="h-8 w-80 mx-auto bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-5 w-96 mx-auto bg-gray-200 dark:bg-gray-800" />
              <Skeleton className="h-10 w-64 mx-auto rounded-full bg-gray-200 dark:bg-gray-800" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl bg-gray-200 dark:bg-gray-800" />
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Skeleton className="h-12 w-full sm:w-52 bg-gray-200 dark:bg-gray-800 rounded-xl" />
              <Skeleton className="h-12 w-full sm:w-52 bg-gray-200 dark:bg-gray-800 rounded-xl" />
            </div>
            <Skeleton className="h-4 w-44 bg-gray-200 dark:bg-gray-800" />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
