/** @format */

"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useRef } from "react";

import { Button } from "@/components/ui/button";
import { useCartMutations } from "../../hooks/useMarketplaceProducts";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { animateFlyToCart } from "../../utils/fly-to-cart";

type MarketplaceCardProduct = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  image?: string;
  badge?: { label: string; variant?: "primary" | "danger" };
  inStock?: boolean;
  requiresVariant?: boolean;
};

export function ProductCard({ product }: { product: MarketplaceCardProduct }) {
  const requiresVariant = product.requiresVariant ?? false;
  const ctaLabel = requiresVariant ? "Pilih Varian" : product.badge?.label ?? "Beli Sekarang";
  const detailHref = `/marketplace/${product.id}`;
  const { addItem } = useCartMutations();
  const imgRef = useRef<HTMLDivElement | null>(null);

  const isAdding = useMemo(() => addItem.isPending, [addItem.isPending]);
  const handleAdd = () =>
    addItem.mutate(
      { product_id: Number(product.id), quantity: 1 },
      {
        onSuccess: () => {
          animateFlyToCart(imgRef.current, product.image);
          showToastSuccess("Berhasil", "Produk ditambahkan ke keranjang.");
        },
        onError: (err: any) => showToastError("Gagal menambahkan ke keranjang", err),
      }
    );

  return (
    <div
      className="bg-card rounded-xl shadow-sm hover:shadow-xl transition duration-300 border border-border overflow-hidden flex flex-col group"
      data-testid={`marketplace-product-card-${product.id}`}
    >
      <div className="relative h-48 overflow-hidden bg-muted" ref={imgRef}>
        {product.image ? (
          <Image
            alt={product.title}
            src={product.image}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold text-muted-foreground">
            Tidak ada foto
          </div>
        )}
        {product.badge ? (
          <div
            className={`absolute top-3 right-3 px-2 py-1 text-xs font-bold rounded shadow-sm ${
              product.badge.variant === "danger"
                ? "bg-destructive text-destructive-foreground"
                : "bg-card/90 backdrop-blur text-indigo-600 dark:text-indigo-400"
            }`}
          >
            {product.badge.label}
          </div>
        ) : null}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-muted-foreground mb-1 font-medium">
          {product.category}
        </div>
        <h3 className="font-bold text-lg text-foreground mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {product.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg">
            {product.price}
          </span>
          <span className="text-xs text-muted-foreground">/ {product.unit}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-border flex gap-2">
          <Button
            data-testid={`marketplace-product-card-open-detail-${product.id}`}
            asChild
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition h-auto"
            disabled={!product.inStock}
          >
            <Link href={detailHref}>{ctaLabel}</Link>
          </Button>
          <Button
            data-testid={`marketplace-product-card-secondary-action-${product.id}`}
            variant="outline"
            className="px-3 py-2 border border-border rounded-lg hover:bg-muted text-muted-foreground transition h-auto"
            title={requiresVariant ? "Pilih Varian" : "Tambah ke Keranjang"}
            disabled={!product.inStock || isAdding}
            onClick={requiresVariant ? undefined : handleAdd}
            asChild={requiresVariant}
          >
            {requiresVariant ? (
              <Link href={detailHref}>
                <span className="material-icons-outlined text-sm">tune</span>
              </Link>
            ) : (
              <span className="material-icons-outlined text-sm">
                {isAdding ? "hourglass_top" : "add_shopping_cart"}
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
