/** @format */

"use client";

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
  useMarketplaceProductVariants,
} from "./hooks/useMarketplaceProducts";
import { formatCurrency } from "@/lib/format";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Props = {
  productId: string;
};

export function MarketplaceProductDetailPage({ productId }: Props) {
  const { data, isLoading, isError, error, refetch } =
    useMarketplaceProductDetail(productId);
  const { data: variants } = useMarketplaceProductVariants(productId);
  const { data: cart } = useMarketplaceCart();
  const router = useRouter();
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const notFoundLike =
    isError && error?.message?.toLowerCase().includes("not found");
  useEffect(() => {
    if (notFoundLike) {
      router.replace("/404");
    }
  }, [notFoundLike, router]);
  useEffect(() => {
    setSelectedGroupId(null);
    setSelectedOptionId(null);
  }, [productId]);

  const variantGroups = useMemo(
    () => variants?.groups ?? [],
    [variants?.groups]
  );
  const hasVariants = variantGroups.length > 0 || data?.has_variants === true;
  const variantsRequired = data?.variants_required ?? hasVariants;
  const selectedGroup = useMemo(
    () => variantGroups.find((group) => group.id === selectedGroupId) ?? null,
    [variantGroups, selectedGroupId]
  );
  const selectedOption = useMemo(
    () =>
      selectedGroup?.options?.find(
        (option) => option.id === selectedOptionId
      ) ?? null,
    [selectedGroup, selectedOptionId]
  );
  const selectionReady =
    !variantsRequired || Boolean(selectedGroup && selectedOption);
  const hasSelection = Boolean(selectedGroup && selectedOption);
  const selectedPrice =
    selectedOption && selectedOption.price > 0 ? selectedOption.price : null;
  const priceAvailable =
    !variantsRequired || (hasSelection && selectedPrice !== null);
  const displayTrackStock = selectionReady
    ? selectedOption?.track_stock ?? data?.track_stock
    : false;
  const displayStock = selectionReady
    ? selectedOption?.stock ?? data?.stock
    : data?.stock;
  const effectiveInStock = displayTrackStock ? (displayStock ?? 0) > 0 : true;
  const canAddToCart = selectionReady && effectiveInStock && priceAvailable;
  const stockLabel =
    variantsRequired && !selectionReady
      ? "Pilih varian untuk melihat stok"
      : displayTrackStock
      ? `Stok tersedia: ${displayStock ?? 0} pcs`
      : "Stok tersedia";
  const galleryImage =
    selectedGroup?.image_url ??
    data?.display_image_url ??
    data?.photo_url ??
    "";

  const priceLabel = variantsRequired
    ? !hasSelection
      ? "Pilih varian untuk melihat harga"
      : selectedPrice !== null
      ? formatCurrency(selectedPrice) ?? "-"
      : "Harga belum tersedia"
    : data?.price
    ? formatCurrency(data.price) ?? "-"
    : "-";

  const product: any = data
    ? {
        id: String(data.id),
        breadcrumbTitle: data.name,
        title: data.name,
        variantLabel: PRODUCT_DETAIL.variantLabel,
        categoryTag: data.sku || "Produk",
        rating: PRODUCT_DETAIL.rating,
        price: priceLabel,
        originalPrice: "",
        discountNote: "",
        shortDescription: data.description ?? "",
        longDescription: data.description ? [data.description] : [],
        features: [],
        stock: stockLabel,
        availableStock: displayTrackStock ? displayStock ?? 0 : undefined,
        trackStock: displayTrackStock,
        inStock: selectionReady ? effectiveInStock : true,
        seller: PRODUCT_DETAIL.seller,
        badge:
          selectionReady && !effectiveInStock
            ? { label: "Stok Habis", variant: "danger" }
            : undefined,
        gallery: {
          main: galleryImage,
          thumbnails: [],
        },
        specs: [],
        related: [],
        reviews: [],
      }
    : null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <LandingNavbar
        activeLabel="Marketplace"
        showCart
        cartCount={cart?.item_count ?? 0}
      />
      <main className="pt-28 pb-20 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProductBreadcrumbs
            category={product?.categoryTag ?? "Marketplace"}
            title={product?.breadcrumbTitle ?? product?.title ?? "Produk"}
          />

          {isLoading ? (
            <div className="py-12 text-center text-muted-foreground">
              Memuat detail produk...
            </div>
          ) : null}
          {isError && !notFoundLike ? (
            <div className="py-12 text-center text-destructive space-y-3">
              <div>Gagal memuat produk.</div>
              <button
                onClick={() => refetch()}
                className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted text-foreground"
              >
                Coba lagi
              </button>
            </div>
          ) : null}
          {!isLoading && !product && !isError ? (
            <div className="py-12 text-center text-muted-foreground">
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
                  <ProductMainInfo
                    product={product}
                    variantState={{
                      hasVariants: variantsRequired,
                      groups: variantGroups,
                      selectedGroupId,
                      selectedOptionId,
                      selectionReady,
                      onSelectGroup: (groupId) => {
                        setSelectedGroupId(groupId);
                        setSelectedOptionId(null);
                      },
                      onSelectOption: (optionId) =>
                        setSelectedOptionId(optionId),
                    }}
                    canAddToCart={canAddToCart}
                    priceAvailable={priceAvailable}
                  />
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
  );
}
