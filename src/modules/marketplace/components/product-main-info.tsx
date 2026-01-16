/** @format */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useCartMutations } from "../hooks/useMarketplaceProducts";
import { showToastError } from "@/lib/toast";
import { MarketplaceProductDetail } from "../constants";
import type { MarketplaceVariantGroupResponse } from "@/types/api/marketplace";
import { animateFlyToCart } from "../utils/fly-to-cart";

type VariantState = {
  hasVariants: boolean;
  groups: MarketplaceVariantGroupResponse[];
  selectedGroupId: number | null;
  selectedOptionId: number | null;
  selectionReady: boolean;
  onSelectGroup: (groupId: number) => void;
  onSelectOption: (optionId: number) => void;
};

const formatAttributeLabel = (attributes?: Record<string, string>) => {
  if (!attributes || Object.keys(attributes).length === 0) {
    return "";
  }
  return Object.entries(attributes)
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ").trim();
      const title = label ? label[0].toUpperCase() + label.slice(1) : "";
      return title ? `${title} ${value}`.trim() : value;
    })
    .filter(Boolean)
    .join(" / ");
};

export function ProductMainInfo({
  product,
  variantState,
  canAddToCart,
  priceAvailable = true,
}: {
  product: MarketplaceProductDetail;
  variantState?: VariantState;
  canAddToCart: boolean;
  priceAvailable?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartMutations();
  const actionBtnRef = useRef<HTMLButtonElement | null>(null);
  const activeVariantState = variantState?.hasVariants ? variantState : null;
  const selectedGroup = activeVariantState
    ? activeVariantState.groups.find(
        (group) => group.id === activeVariantState.selectedGroupId
      ) ?? null
    : null;

  const maxQty = product.trackStock
    ? Math.max(1, product.availableStock ?? 0)
    : undefined;
  const clamp = (val: number) => {
    if (maxQty !== undefined) {
      return Math.min(Math.max(1, val), maxQty);
    }
    return Math.max(1, val);
  };

  const decrease = () => setQuantity((prev) => clamp(prev - 1));
  const increase = () => setQuantity((prev) => clamp(prev + 1));

  const handleAdd = async () => {
    const qty = clamp(quantity);
    if (activeVariantState && !activeVariantState.selectionReady) {
      showToastError("Pilih varian", "Silakan pilih varian terlebih dahulu");
      return;
    }
    if (!priceAvailable) {
      showToastError("Harga belum tersedia", "Silakan pilih varian lain.");
      return;
    }
    if (!canAddToCart) {
      showToastError("Stok habis", "Produk tidak tersedia");
      return;
    }
    if (maxQty !== undefined && maxQty <= 0) {
      showToastError("Stok habis", "Produk tidak tersedia");
      return;
    }
    const payload: {
      product_id: number;
      quantity: number;
      variant_group_id?: number;
      variant_option_id?: number;
    } = {
      product_id: Number(product.id),
      quantity: qty,
    };
    if (activeVariantState?.selectionReady) {
      if (activeVariantState.selectedGroupId) {
        payload.variant_group_id = activeVariantState.selectedGroupId;
      }
      if (activeVariantState.selectedOptionId) {
        payload.variant_option_id = activeVariantState.selectedOptionId;
      }
    }
    addItem.mutate(
      payload,
      {
        onSuccess: () => animateFlyToCart(actionBtnRef.current),
        onError: (err: any) =>
          showToastError("Gagal menambahkan ke keranjang", err),
      }
    );
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:p-8 flex-grow">
      <div className="mb-6 border-b border-border pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-md">
            {product.categoryTag}
          </span>
          <span className="flex items-center text-yellow-500 text-sm font-medium gap-1">
            <span className="material-icons-outlined text-base fill-current">
              star
            </span>
            {product.rating.value} ({product.rating.total} Ulasan)
          </span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-extrabold text-foreground mb-2 leading-tight">
          {product.title}
        </h1>
        <div className="flex items-center gap-3 mt-4">
          <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
            <Image
              alt="Seller"
              className="h-full w-full object-cover"
              src={product.seller.avatar}
              width={40}
              height={40}
            />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {product.seller.name}
            </p>
            <div className="flex items-center text-xs text-muted-foreground gap-1">
              <span className="material-icons-outlined text-sm">
                location_on
              </span>
              {product.seller.location}
            </div>
          </div>
          <Button
            variant="outline"
            className="ml-auto text-indigo-600 dark:text-indigo-400 border-indigo-500 px-3 py-1 rounded-full hover:bg-indigo-500/10 transition h-auto"
          >
            Kunjungi Toko
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {product.price}
          </span>
          {product.originalPrice ? (
            <span className="text-sm text-muted-foreground line-through ml-2">
              {product.originalPrice}
            </span>
          ) : null}
          {product.discountNote ? (
            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded ml-2">
              {product.discountNote}
            </span>
          ) : null}
        </div>

        <p className="text-muted-foreground leading-relaxed">
          {product.shortDescription}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeVariantState ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {product.variantLabel}
                </label>
                <div className="flex flex-wrap gap-2">
                  {activeVariantState.groups.map((group) => {
                    const isSelected =
                      group.id === activeVariantState.selectedGroupId;
                    return (
                      <button
                        key={group.id}
                        type="button"
                        onClick={() => activeVariantState.onSelectGroup(group.id)}
                        className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                          isSelected
                            ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                            : "border-border text-muted-foreground hover:border-indigo-500"
                        }`}
                      >
                        {group.image_url ? (
                          <Image
                            src={group.image_url}
                            alt={group.name}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        ) : null}
                        <span>{group.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Ukuran
                </label>
                {selectedGroup ? (
                  <div className="flex flex-wrap gap-2">
                    {(selectedGroup.options ?? []).map((option) => {
                      const label =
                        formatAttributeLabel(option.attributes) || option.sku;
                      const isSelected =
                        option.id === activeVariantState.selectedOptionId;
                      const isOutOfStock =
                        option.track_stock && option.stock <= 0;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => activeVariantState.onSelectOption(option.id)}
                          disabled={isOutOfStock}
                          className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition ${
                            isSelected
                              ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
                              : "border-border text-muted-foreground hover:border-indigo-500"
                          } ${isOutOfStock ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Pilih varian terlebih dahulu.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {product.variantLabel}
              </label>
              <div className="rounded-lg border border-border bg-muted/40 px-4 py-2 text-sm text-muted-foreground">
                Standar
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Jumlah
            </label>
            <div className="flex items-center border border-border rounded-lg w-fit overflow-hidden">
              <button
                type="button"
                onClick={decrease}
                className="px-3 py-2 bg-muted/40 hover:bg-muted text-muted-foreground border-r border-border"
              >
                <span className="material-icons-outlined text-sm">remove</span>
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-none focus:ring-0 bg-card text-foreground font-medium"
              />
              <button
                type="button"
                onClick={increase}
                disabled={maxQty !== undefined && quantity >= maxQty}
                className="px-3 py-2 bg-muted/40 hover:bg-muted text-muted-foreground border-l border-border disabled:opacity-50"
              >
                <span className="material-icons-outlined text-sm">add</span>
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{product.stock}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 h-auto"
            ref={actionBtnRef}
            disabled={!canAddToCart}
            onClick={handleAdd}
          >
            <span className="material-icons-outlined text-xl">
              shopping_bag
            </span>
            Beli Sekarang
          </Button>
          <Button
            variant="outline"
            className="flex-1 border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 h-auto"
            disabled={!canAddToCart}
            onClick={handleAdd}
          >
            <span className="material-icons-outlined text-xl">
              add_shopping_cart
            </span>
            + Keranjang
          </Button>
          <Button
            variant="outline"
            className="px-4 py-3 border border-border rounded-xl hover:bg-muted transition text-muted-foreground hover:text-destructive h-auto"
            title="Tambah ke Wishlist"
          >
            <span className="material-icons-outlined text-xl">favorite</span>
          </Button>
        </div>

        <div className="bg-muted/40 rounded-lg p-4 flex items-start gap-3 mt-6">
          <span className="material-icons-outlined text-muted-foreground">
            local_shipping
          </span>
          <div className="text-sm">
            <p className="font-bold text-foreground">
              Pengiriman dari Desa Sukamaju
            </p>
            <p className="text-muted-foreground mt-0.5">
              Estimasi tiba 2 - 4 hari ke alamat tujuan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
