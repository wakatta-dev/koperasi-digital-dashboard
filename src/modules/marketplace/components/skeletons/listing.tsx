/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { CART_BADGE } from "../../constants";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { LandingFooter } from "@/modules/landing/components/footer";

const FILTER_ROW_SKELETON_IDS = [
  "filter-row-1",
  "filter-row-2",
  "filter-row-3",
  "filter-row-4",
  "filter-row-5",
];
const PRODUCT_CARD_SKELETON_IDS = [
  "product-card-1",
  "product-card-2",
  "product-card-3",
  "product-card-4",
  "product-card-5",
  "product-card-6",
];
const PAGINATION_SKELETON_IDS = [
  "pagination-1",
  "pagination-2",
  "pagination-3",
  "pagination-4",
  "pagination-5",
];

function FilterCardSkeleton() {
  return (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-3">
      <Skeleton className="h-5 w-24" />
      {FILTER_ROW_SKELETON_IDS.map((id) => (
        <div key={id} className="flex items-center gap-3">
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
                {PRODUCT_CARD_SKELETON_IDS.map((id) => (
                  <ProductCardSkeleton key={id} />
                ))}
              </div>
              <div className="mt-12 flex justify-center gap-2">
                {PAGINATION_SKELETON_IDS.map((id) => (
                  <Skeleton key={id} className="h-10 w-10 rounded-lg" />
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
