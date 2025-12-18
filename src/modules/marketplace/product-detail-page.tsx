/** @format */

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { MarketplaceNavbar } from "./components/navbar";
import { ProductBreadcrumbs } from "./components/product-breadcrumbs";
import { ProductGallery } from "./components/product-gallery";
import { ProductMainInfo } from "./components/product-main-info";
import { ProductDetailsContent } from "./components/product-details-content";
import { ProductSpecsCard } from "./components/product-specs-card";
import { SafetyBanner } from "./components/safety-banner";
import { RelatedProducts } from "./components/related-products";
import { PRODUCT_DETAIL } from "./constants";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export function MarketplaceProductDetailPage() {
  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <MarketplaceNavbar />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductBreadcrumbs
              category={PRODUCT_DETAIL.categoryTag}
              title={PRODUCT_DETAIL.breadcrumbTitle ?? PRODUCT_DETAIL.title}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5">
                <ProductGallery />
              </div>
              <div className="lg:col-span-7 flex flex-col">
                <ProductMainInfo />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <ProductDetailsContent />

              <div className="space-y-6">
                <ProductSpecsCard />
                <SafetyBanner />
              </div>
            </div>

            <RelatedProducts />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
