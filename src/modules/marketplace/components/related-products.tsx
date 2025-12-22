/** @format */

"use client";

import { useMemo } from "react";
import Link from "next/link";

import { formatCurrency } from "@/lib/format";
import { useMarketplaceProducts } from "../hooks/useMarketplaceProducts";

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
    <div className="mt-16 border-t border-gray-200 dark:border-gray-700 pt-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Produk Lain dari Desa</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col group"
          >
            <div className="relative h-48 overflow-hidden bg-gray-200">
              <img
                alt={product.name}
                src={product.photo_url || "https://via.placeholder.com/400x300?text=Produk"}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-medium">{product.sku || "Produk"}</div>
              <h3 className="font-bold text-base text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-[#4338ca] transition">
                {product.name}
              </h3>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-[#4338ca] font-bold text-lg">{formatCurrency(product.price)}</span>
                <span className="text-xs text-gray-400">/ unit</span>
              </div>
              <Link
                href={`/marketplace/${product.id}`}
                className="w-full mt-3 bg-white border border-[#4338ca] text-[#4338ca] hover:bg-[#4338ca] hover:text-white text-sm font-medium py-2 rounded-lg transition text-center"
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
