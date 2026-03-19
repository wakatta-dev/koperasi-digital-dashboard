/** @format */

import { Skeleton } from "@/components/ui/skeleton";
import { LandingFooter } from "@/modules/landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { CART_BADGE } from "../../constants";

const REVIEW_STEP_SKELETON_IDS = [
  "review-step-1",
  "review-step-2",
  "review-step-3",
  "review-step-4",
];
const REVIEW_CARD_SKELETON_IDS = [
  "review-card-1",
  "review-card-2",
  "review-card-3",
];
const REVIEW_SUMMARY_SKELETON_IDS = [
  "review-summary-1",
  "review-summary-2",
  "review-summary-3",
  "review-summary-4",
];

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
              {REVIEW_STEP_SKELETON_IDS.map((id) => (
                <StepSkeleton key={id} />
              ))}
            </div>
          </div>
          <Skeleton className="h-8 w-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            <div className="lg:col-span-8 space-y-6">
              {REVIEW_CARD_SKELETON_IDS.map((id) => (
                <div
                  key={id}
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
                {REVIEW_SUMMARY_SKELETON_IDS.map((id) => (
                  <div key={id} className="flex justify-between items-center">
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
