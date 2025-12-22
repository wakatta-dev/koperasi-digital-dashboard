/** @format */

"use client";

import { useMemo, useState } from "react";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { SORT_OPTIONS } from "../constants";
import { ProductCard } from "./product-card";
import { Pagination } from "./pagination";
import type { MarketplaceFilters } from "../types";

type Props = {
  search?: string;
  filters: MarketplaceFilters;
};

export function ProductsSection({ search, filters }: Props) {
  const [sort, setSort] = useState<string>(SORT_OPTIONS[0]);
  const params = useMemo(
    () =>
      ({
        q: search,
        include_hidden: true,
        min_price: filters.priceMin,
        max_price: filters.priceMax,
      }) satisfies Parameters<typeof useMarketplaceProducts>[0],
    [filters.priceMax, filters.priceMin, search]
  );
  const { data, isLoading, isError } = useMarketplaceProducts(params);

  const filteredData = useMemo(() => {
    const list = data ?? [];
    const hasCategoryFilter = filters.categories && !filters.categories.includes("all");
    return list.filter((product) => {
      if (filters.priceMin !== undefined && product.price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && product.price > filters.priceMax) return false;

      if (hasCategoryFilter) {
        const haystack = `${product.name} ${product.description ?? ""} ${product.sku}`.toLowerCase();
        const match = filters.categories.some((cat) => haystack.includes(cat.toLowerCase()));
        if (!match) return false;
      }

      if (filters.producer && filters.producer !== "all") {
        const haystack = `${product.description ?? ""} ${product.sku}`.toLowerCase();
        if (!haystack.includes(filters.producer.toLowerCase())) return false;
      }
      return true;
    });
  }, [data, filters.categories, filters.priceMax, filters.priceMin, filters.producer]);

  const sortedData = useMemo(() => {
    const list = [...filteredData];
    switch (sort) {
      case "Harga Terendah":
        return list.sort((a, b) => a.price - b.price);
      case "Harga Tertinggi":
        return list.sort((a, b) => b.price - a.price);
      case "Terbaru":
        return list.sort((a, b) => Number(b.id) - Number(a.id));
      default:
        return list;
    }
  }, [filteredData, sort]);

  const displayMeta = useMemo(() => {
    const total = sortedData.length;
    return { start: total === 0 ? 0 : 1, end: total, total };
  }, [sortedData]);

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
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border-none bg-transparent font-medium text-gray-900 dark:text-white focus:ring-0 cursor-pointer"
          >
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
        {sortedData?.map((product) => (
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
