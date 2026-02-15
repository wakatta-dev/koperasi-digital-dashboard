/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { CART_BADGE } from "../../constants";

function StepSkeleton() {
  return (
    <div className="relative flex flex-col items-center z-10 group cursor-default">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-20 mt-2" />
    </div>
  );
}

export function MarketplaceReviewSkeleton() {
  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Skeleton className="h-4 w-96" />
          <div className="w-full max-w-4xl mx-auto mb-8 pt-2">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0"></div>
              {[...Array(4)].map((_, idx) => (
                <StepSkeleton key={idx} />
              ))}
            </div>
          </div>
          <Skeleton className="h-8 w-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-6">
              {[...Array(3)].map((_, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4"
                >
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
              <Skeleton className="h-4 w-48" />
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
                <Skeleton className="h-11 w-full" />
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
