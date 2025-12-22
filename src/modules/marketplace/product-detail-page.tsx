/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { ProductBreadcrumbs } from "./components/product-breadcrumbs";
import { ProductGallery } from "./components/product-gallery";
import { ProductMainInfo } from "./components/product-main-info";
import { ProductDetailsContent } from "./components/product-details-content";
import { ProductSpecsCard } from "./components/product-specs-card";
import { SafetyBanner } from "./components/safety-banner";
import { RelatedProducts } from "./components/related-products";
import { CART_BADGE, PRODUCT_DETAIL } from "./constants";
import { useMarketplaceProductDetail } from "./hooks/useMarketplaceProducts";
import { formatCurrency } from "@/lib/format";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Props = {
  productId: string;
};

export function MarketplaceProductDetailPage({ productId }: Props) {
  const { data, isLoading, isError } = useMarketplaceProductDetail(productId);

  const product = data
    ? {
        ...PRODUCT_DETAIL,
        id: String(data.id),
        title: data.name,
        breadcrumbTitle: data.name,
        price: formatCurrency(data.price) ?? "-",
        shortDescription: data.description ?? PRODUCT_DETAIL.shortDescription,
        stock: data.track_stock ? `Stok tersedia: ${data.stock} pcs` : "Stok tersedia",
        gallery: {
          main:
            data.photo_url ??
            PRODUCT_DETAIL.gallery.main ??
            "https://via.placeholder.com/640x480?text=Produk",
          thumbnails: PRODUCT_DETAIL.gallery.thumbnails.filter(Boolean),
        },
      }
    : PRODUCT_DETAIL;

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar activeLabel="Marketplace" showCart cartCount={CART_BADGE} />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductBreadcrumbs
              category={product.categoryTag}
              title={product.breadcrumbTitle ?? product.title}
            />

            {isLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Memuat detail produk...
              </div>
            ) : null}
            {isError ? (
              <div className="py-12 text-center text-red-500">Gagal memuat produk.</div>
            ) : null}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              <div className="lg:col-span-5">
                <ProductGallery product={product} />
              </div>
              <div className="lg:col-span-7 flex flex-col">
                <ProductMainInfo product={product} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              <ProductDetailsContent product={product} />

              <div className="space-y-6">
                <ProductSpecsCard product={product} />
                <SafetyBanner />
              </div>
            </div>

            <RelatedProducts products={product.related} />
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
