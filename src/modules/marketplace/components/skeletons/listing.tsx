/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { CART_BADGE } from "../../constants";
import { LandingNavbar } from "@/modules/landing/components/navbar";
import { LandingFooter } from "@/modules/landing/components/footer";

function FilterCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-3">
      <Skeleton className="h-5 w-24" />
      {[...Array(5)].map((_, idx) => (
        <div key={idx} className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden flex flex-col">
      <Skeleton className="h-48 w-full" />
      <div className="p-5 flex flex-col flex-grow space-y-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-28" />
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-10" />
        </div>
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-12" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceListingSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar
        activeLabel="Marketplace"
        showCart
        cartCount={CART_BADGE}
      />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80" />
            <div className="bg-card p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
              <Skeleton className="h-11 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-11 w-48" />
                <Skeleton className="h-11 w-20" />
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
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-9 w-32" />
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
                    className="h-10 w-10 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
