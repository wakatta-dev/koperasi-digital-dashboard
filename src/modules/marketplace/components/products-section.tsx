/** @format */

"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";

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
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const params = useMemo(
    () =>
      ({
        q: search,
        min_price: filters.priceMin,
        max_price: filters.priceMax,
        limit,
        offset,
        sort: sortToParam(sort),
      }) satisfies Parameters<typeof useMarketplaceProducts>[0],
    [filters.priceMax, filters.priceMin, offset, search, sort]
  );
  const { data, isLoading, isError, refetch, isFetching } = useMarketplaceProducts(params);

  useEffect(() => {
    setOffset(0);
  }, [search, filters.priceMin, filters.priceMax]);

  const items = data?.items ?? [];
  const total = data?.total ?? items.length;
  const displayMeta = useMemo(() => {
    const start = total === 0 ? 0 : offset + 1;
    const end = Math.min(offset + items.length, total);
    return { start, end, total };
  }, [items.length, offset, total]);

  const hasNext = offset + limit < total;
  const hasPrev = offset > 0;

  const handleChangeSort = (value: string) => {
    setSort(value);
    setOffset(0);
  };

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
            onChange={(e) => handleChangeSort(e.target.value)}
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
        <div className="text-center text-red-500 py-10 space-y-3">
          <div>Gagal memuat produk.</div>
          <button
            onClick={() => refetch()}
            className="text-sm px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12 space-y-2">
          <div className="font-semibold text-gray-700 dark:text-gray-200">Produk tidak ditemukan</div>
          <div className="text-sm">Coba hapus pencarian atau ubah filter untuk melihat produk lainnya.</div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: String(product.id),
              title: product.name,
              description: product.description ?? "",
              category: product.sku || "Produk",
              price: formatCurrency(product.price),
              unit: "unit",
              image: product.photo_url || undefined,
              inStock: product.in_stock,
            }}
          />
        ))}
      </div>

      <Pagination
        total={total}
        limit={limit}
        offset={offset}
        hasNext={hasNext}
        hasPrev={hasPrev}
        onNext={() => hasNext && setOffset((prev) => prev + limit)}
        onPrev={() => hasPrev && setOffset((prev) => Math.max(0, prev - limit))}
        isLoading={isFetching}
      />
    </div>
  );
}

function sortToParam(label: string) {
  switch (label) {
    case "Harga Terendah":
      return "price_asc";
    case "Harga Tertinggi":
      return "price_desc";
    case "Terbaru":
      return "newest";
    default:
      return "newest";
  }
}
