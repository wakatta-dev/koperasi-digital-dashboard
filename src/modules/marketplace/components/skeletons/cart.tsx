/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/modules/landing/components/navbar";
import { CART_BADGE } from "../../constants";

function StepSkeleton() {
  return (
    <div className="relative flex flex-col items-center z-10 group cursor-default">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-20 mt-2" />
    </div>
  );
}

function CartItemSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 pb-6 border-b border-border">
      <Skeleton className="w-full sm:w-32 h-32 rounded-xl" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-28" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

export function MarketplaceCartSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Skeleton className="h-4 w-64" />
          <div className="w-full max-w-4xl mx-auto mb-8 pt-2">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
              {[...Array(4)].map((_, idx) => (
                <StepSkeleton key={idx} />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <CartItemSkeleton />
                <CartItemSkeleton />
              </div>
              <Skeleton className="h-4 w-44" />
            </div>
            <div className="lg:col-span-4">
              <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
                <Skeleton className="h-5 w-40" />
                {[...Array(4)].map((_, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
