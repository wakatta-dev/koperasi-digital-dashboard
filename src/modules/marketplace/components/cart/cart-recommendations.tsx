/** @format */

"use client";

import { useMemo } from "react";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../../hooks/useMarketplaceProducts";
import { ProductCard } from "../product/product-card";

type Props = {
  currentProductId?: string | number;
};

export function CartRecommendations({ currentProductId }: Props) {
  const { data, isLoading, isError } = useMarketplaceProducts({ limit: 8, sort: "newest" });
  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (!currentProductId) return list;
    return list.filter((item) => String(item.id) !== String(currentProductId));
  }, [currentProductId, data?.items]);

  if (isLoading || isError || !items.length) return null;

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Mungkin Anda Suka</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: String(product.id),
              title: product.name,
              description: product.description ?? "",
              category: product.sku || "Produk",
              price: (() => {
                const hasVariants =
                  product.variants_required ?? product.has_variants ?? false;
                const priceValue = hasVariants
                  ? product.min_price
                  : product.price ?? product.min_price;
                if (hasVariants) {
                  return priceValue && priceValue > 0
                    ? `Mulai dari ${formatCurrency(priceValue)}`
                    : "Harga belum tersedia";
                }
                return priceValue && priceValue > 0
                  ? formatCurrency(priceValue)
                  : "—";
              })(),
              unit: "unit",
              image: product.display_image_url || product.photo_url || undefined,
              inStock: product.in_stock,
              requiresVariant:
                product.variants_required ?? product.has_variants ?? false,
            }}
          />
        ))}
      </div>
    </div>
  );
}
