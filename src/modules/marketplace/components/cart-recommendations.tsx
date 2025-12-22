/** @format */

"use client";

import { useMemo } from "react";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { ProductCard } from "./product-card";

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
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mungkin Anda Suka</h2>
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
              price: formatCurrency(product.price),
              unit: "unit",
              image: product.photo_url || "https://via.placeholder.com/400x300?text=Produk",
              inStock: product.in_stock,
            }}
          />
        ))}
      </div>
    </div>
  );
}
