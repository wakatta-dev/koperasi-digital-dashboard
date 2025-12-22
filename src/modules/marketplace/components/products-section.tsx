/** @format */

"use client";

import { useMemo } from "react";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { SORT_OPTIONS } from "../constants";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";

type Props = {
  search?: string;
};

export function ProductsSection({ search }: Props) {
  const params = useMemo(
    () => (search ? { q: search, include_hidden: true } : { include_hidden: true }),
    [search]
  );
  const { data, isLoading, isError } = useMarketplaceProducts(params);

  const displayMeta = useMemo(() => {
    const total = data?.length ?? 0;
    return { start: total === 0 ? 0 : 1, end: total, total };
  }, [data]);

  return (
    <div className="lg:col-span-3">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Menampilkan{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {displayMeta.start} - {displayMeta.end}
          </span>{" "}
          dari {displayMeta.total} produk
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Urutkan:</span>
          <select className="text-sm border-none bg-transparent font-medium text-gray-900 dark:text-white focus:ring-0 cursor-pointer">
            {SORT_OPTIONS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-10">Memuat produk...</div>
      ) : null}
      {isError ? (
        <div className="text-center text-red-500 py-10">Gagal memuat produk.</div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((product) => (
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

      <Pagination total={displayMeta.total} />
    </div>
  );
}
