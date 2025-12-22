/** @format */

"use client";

import Link from "next/link";

import type { MarketplaceCartResponse } from "@/types/api/marketplace";
import { useMarketplaceCart, useCartMutations } from "../hooks/useMarketplaceProducts";
import { CartItemCard } from "./cart-item-card";

type Props = {
  cart?: MarketplaceCartResponse;
};

export function CartItemsSection({ cart }: Props) {
  const { data, isLoading, isError } = useMarketplaceCart({ enabled: !cart });
  const { updateItem, removeItem } = useCartMutations();
  const activeCart = cart ?? data;

  return (
    <div className="lg:col-span-8 space-y-6">
      {isLoading ? (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-gray-500">
          Memuat keranjang...
        </div>
      ) : null}
      {isError ? (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-red-500">
          Gagal memuat keranjang.
        </div>
      ) : null}
      {activeCart ? (
        <CartItemCard
          items={activeCart.items}
          onQuantityChange={(itemId, qty) => updateItem.mutate({ itemId, quantity: qty })}
          onRemove={(itemId) => removeItem.mutate(itemId)}
        />
      ) : null}
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-2 text-[#4338ca] dark:text-indigo-400 font-bold hover:underline transition group"
      >
        <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
        Lanjutkan Belanja
      </Link>
    </div>
  );
}
