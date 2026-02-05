/** @format */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import type { MarketplaceCartResponse } from "@/types/api/marketplace";
import {
  useMarketplaceCart,
  useCartMutations,
} from "../../hooks/useMarketplaceProducts";
import { CartItemCard } from "./cart-item-card";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { QK } from "@/hooks/queries/queryKeys";

type Props = {
  cart?: MarketplaceCartResponse;
};

export function CartItemsSection({ cart }: Props) {
  const { data, isLoading, isError } = useMarketplaceCart({ enabled: !cart });
  const { updateItem, removeItem } = useCartMutations();
  const activeCart = cart ?? data;
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const qc = useQueryClient();

  const handleError = (title: string, err: any) => {
    showToastError(title, err);
    const msg = (err as Error)?.message?.toLowerCase() ?? "";
    if (msg.includes("not available")) {
      qc.invalidateQueries({ queryKey: QK.marketplace.cart() });
    }
  };

  return (
    <div className="lg:col-span-8 space-y-6">
      {isLoading ? (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-muted-foreground">
          Memuat keranjang...
        </div>
      ) : null}
      {isError ? (
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 text-destructive">
          Gagal memuat keranjang.
        </div>
      ) : null}
      {activeCart && activeCart?.items?.length > 0 ? (
        <CartItemCard
          items={activeCart.items}
          updatingId={updatingId}
          removingId={removingId}
          onQuantityChange={(itemId, qty) => {
            setUpdatingId(itemId);
            updateItem.mutate(
              { itemId, quantity: qty },
              {
                onSuccess: () =>
                  showToastSuccess("Berhasil", "Jumlah diperbarui"),
                onError: (err) => handleError("Gagal memperbarui jumlah", err),
                onSettled: () => setUpdatingId(null),
              }
            );
          }}
          onRemove={(itemId) => {
            setRemovingId(itemId);
            removeItem.mutate(itemId, {
              onSuccess: () =>
                showToastSuccess("Berhasil", "Produk dihapus dari keranjang"),
              onError: (err) => handleError("Gagal menghapus produk", err),
              onSettled: () => setRemovingId(null),
            });
          }}
        />
      ) : null}
    <Link
      href="/marketplace"
      className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition group"
    >
        <span className="material-icons-outlined text-lg group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Lanjutkan Belanja
      </Link>
    </div>
  );
}
