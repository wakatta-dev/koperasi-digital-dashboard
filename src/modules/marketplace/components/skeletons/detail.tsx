/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/modules/landing/components/navbar";
import { CART_BADGE } from "../../constants";

export function MarketplaceDetailSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Skeleton className="h-4 w-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-5 space-y-4">
              <Skeleton className="h-[420px] w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)].map((_, idx) => (
                  <Skeleton key={idx} className="aspect-square w-full rounded-xl" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-7 space-y-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-64" />
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="h-20 w-full" />
              ))}
            </div>
            <div className="space-y-4">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
