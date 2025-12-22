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
import { PRODUCT_DETAIL } from "./constants";
import {
  useMarketplaceCart,
  useMarketplaceProductDetail,
} from "./hooks/useMarketplaceProducts";
import { formatCurrency } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type Props = {
  productId: string;
};

export function MarketplaceProductDetailPage({ productId }: Props) {
  const { data, isLoading, isError, error, refetch } =
    useMarketplaceProductDetail(productId);
  const { data: cart } = useMarketplaceCart();
  const router = useRouter();

  const notFoundLike =
    isError && error?.message?.toLowerCase().includes("not found");
  useEffect(() => {
    if (notFoundLike) {
      router.replace("/404");
    }
  }, [notFoundLike, router]);

  const product: any = data
    ? {
        id: String(data.id),
        breadcrumbTitle: data.name,
        title: data.name,
        variantLabel: PRODUCT_DETAIL.variantLabel,
        categoryTag: data.sku || "Produk",
        rating: PRODUCT_DETAIL.rating,
        price: formatCurrency(data.price) ?? "-",
        originalPrice: "",
        discountNote: "",
        shortDescription: data.description ?? "",
        longDescription: data.description ? [data.description] : [],
        features: [],
        stock: data.track_stock
          ? `Stok tersedia: ${data.stock} pcs`
          : "Stok tersedia",
        availableStock: data.track_stock ? data.stock : undefined,
        trackStock: data.track_stock,
        inStock: data.in_stock,
        seller: PRODUCT_DETAIL.seller,
        badge: data.in_stock
          ? undefined
          : { label: "Stok Habis", variant: "danger" },
        gallery: {
          main:
            data.photo_url ?? "https://via.placeholder.com/640x480?text=Produk",
          thumbnails: [],
        },
        specs: [],
        related: [],
        reviews: [],
      }
    : null;

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
        <LandingNavbar
          activeLabel="Marketplace"
          showCart
          cartCount={cart?.item_count ?? 0}
        />
        <main className="pt-28 pb-20 bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductBreadcrumbs
              category={product?.categoryTag ?? "Marketplace"}
              title={product?.breadcrumbTitle ?? product?.title ?? "Produk"}
            />

            {isLoading ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Memuat detail produk...
              </div>
            ) : null}
            {isError && !notFoundLike ? (
              <div className="py-12 text-center text-red-500 space-y-3">
                <div>Gagal memuat produk.</div>
                <button
                  onClick={() => refetch()}
                  className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
                >
                  Coba lagi
                </button>
              </div>
            ) : null}
            {!isLoading && !product && !isError ? (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400">
                Produk tidak ditemukan.
              </div>
            ) : null}

            {product ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                  <div className="lg:col-span-5">
                    <ProductGallery product={product} />
                  </div>
                  <div className="lg:col-span-7 flex flex-col">
                    <ProductMainInfo product={product} />
                  </div>
                </div>

                {Boolean(
                  product.longDescription.length || product.features.length
                ) ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                    <ProductDetailsContent product={product} />

                    <div className="space-y-6">
                      {product.specs.length ? (
                        <ProductSpecsCard product={product} />
                      ) : null}
                      <SafetyBanner />
                    </div>
                  </div>
                ) : null}

                <RelatedProducts currentProductId={product.id} />
              </>
            ) : null}
          </div>
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
