/** @format */

"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";

import { formatCurrency } from "@/lib/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMarketplaceProducts } from "../../hooks/useMarketplaceProducts";
import { SORT_OPTIONS } from "../../constants";
import { ProductCard } from "./product-card";
import { Pagination } from "../shared/pagination";
import type { MarketplaceFilters } from "../../types";

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
        <span className="text-sm text-muted-foreground">
          Menampilkan{" "}
          <span className="font-bold text-foreground">
            {displayMeta.start} - {displayMeta.end}
          </span>{" "}
          dari {displayMeta.total} produk
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Urutkan:</span>
          <Select value={sort} onValueChange={handleChangeSort}>
            <SelectTrigger className="text-sm border-none bg-transparent font-medium text-foreground focus-visible:ring-0 h-auto px-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover text-foreground border border-border">
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground py-10">Memuat produk...</div>
      ) : null}
      {isError ? (
        <div className="text-center text-destructive py-10 space-y-3">
          <div>Gagal memuat produk.</div>
          <button
            onClick={() => refetch()}
            className="text-sm px-4 py-2 rounded-lg border border-border hover:bg-muted text-foreground"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <div className="text-center text-muted-foreground py-12 space-y-2">
          <div className="font-semibold text-foreground">Produk tidak ditemukan</div>
          <div className="text-sm">Coba hapus pencarian atau ubah filter untuk melihat produk lainnya.</div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items?.map((product) => {
          const hasVariants = product.variants_required ?? product.has_variants ?? false;
          const priceValue = hasVariants
            ? product.min_price
            : product.price ?? product.min_price;
          const priceLabel = hasVariants
            ? priceValue === undefined || priceValue === null || priceValue <= 0
              ? "Harga belum tersedia"
              : `Mulai dari ${formatCurrency(priceValue)}`
            : priceValue === undefined || priceValue === null || priceValue <= 0
            ? "—"
            : formatCurrency(priceValue);
          return (
            <ProductCard
              key={product.id}
              product={{
                id: String(product.id),
                title: product.name,
                description: product.description ?? "",
                category: product.sku || "Produk",
                price: priceLabel,
                unit: "unit",
                image:
                  product.display_image_url ||
                  product.photo_url ||
                  undefined,
                inStock: product.in_stock,
                requiresVariant: product.variants_required ?? product.has_variants ?? false,
              }}
            />
          );
        })}
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
    case "Terlaris":
      return "newest";
    case "Terbaru":
      return "newest";
    default:
      return "newest";
  }
}
