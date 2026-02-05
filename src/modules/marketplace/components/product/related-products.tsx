/** @format */

"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../../hooks/useMarketplaceProducts";

type Props = {
  currentProductId?: string | number;
};

export function RelatedProducts({ currentProductId }: Props) {
  const { data, isLoading, isError } = useMarketplaceProducts({ limit: 4, sort: "newest" });
  const items = useMemo(() => {
    const list = data?.items ?? [];
    if (!currentProductId) return list;
    return list.filter((item) => String(item.id) !== String(currentProductId));
  }, [currentProductId, data?.items]);

  if (isLoading || isError || !items.length) return null;

  return (
    <div className="mt-16 border-t border-border pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-foreground">Produk Lain dari Desa</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-card rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-border overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 overflow-hidden bg-muted">
              {product.display_image_url || product.photo_url ? (
                <Image
                  alt={product.name}
                  src={product.display_image_url || product.photo_url!}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                  Tidak ada foto
                </div>
              )}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-muted-foreground mb-1 font-medium">{product.sku || "Produk"}</div>
              <h3 className="font-bold text-base text-foreground mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                {product.name}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
                  {(() => {
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
                  })()}
                </span>
                <span className="text-xs text-muted-foreground">/ unit</span>
              </div>
              <Link
                href={`/marketplace/${product.id}`}
                className="w-full mt-3 bg-card border border-indigo-500 text-indigo-600 hover:bg-indigo-600 hover:text-white text-sm font-medium py-2 rounded-lg transition text-center"
              >
                Lihat Detail
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
