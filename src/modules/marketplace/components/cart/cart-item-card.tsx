/** @format */

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MarketplaceCartItemResponse } from "@/types/api/marketplace";
import { formatCurrency } from "@/lib/format";

type Props = {
  items: MarketplaceCartItemResponse[];
  onQuantityChange: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  updatingId?: number | null;
  removingId?: number | null;
};

const formatVariantLabel = (item: MarketplaceCartItemResponse) => {
  const group = item.variant_group_name?.trim();
  const attributes = item.variant_attributes ?? {};
  const size = attributes.size;
  const attributeLabels = Object.entries(attributes)
    .filter(([key]) => key !== "size")
    .map(([key, value]) => {
      const label = key.replace(/_/g, " ").trim();
      const title = label ? label[0].toUpperCase() + label.slice(1) : "";
      return title ? `${title} ${value}`.trim() : value;
    })
    .filter(Boolean)
    .join(" / ");
  const optionLabel = size || attributeLabels || item.variant_sku;
  if (group && optionLabel) return `${group} / ${optionLabel}`;
  return group || optionLabel || "";
};

export function CartItemCard({
  items,
  onQuantityChange,
  onRemove,
  updatingId,
  removingId,
}: Props) {
  const clampQty = (item: MarketplaceCartItemResponse, next: number) => {
    const min = 1;
    const max = item.track_stock ? item.stock : Infinity;
    const target = Math.max(min, next);
    return Math.min(target, max);
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
          <h2 className="font-bold text-lg text-foreground">Daftar Produk</h2>
          <span className="text-sm text-muted-foreground">{items.length} Item Terpilih</span>
        </div>

        {items.map((item) => {
          const variantLabel = formatVariantLabel(item);
          const imageSrc = item.variant_image_url || item.product_photo;
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-border last:border-0 last:pb-0 mb-8 last:mb-0"
            >
              <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-muted rounded-xl overflow-hidden border border-border relative group">
                {imageSrc ? (
                  <Image
                    alt={item.product_name}
                    src={imageSrc}
                    fill
                    sizes="(min-width: 768px) 8rem, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                    Tidak ada foto
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <a
                      className="font-bold text-lg text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition line-clamp-2"
                      href="#"
                    >
                      {item.product_name}
                    </a>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="material-icons-outlined text-sm text-muted-foreground">
                        storefront
                      </span>
                      <span className="text-sm text-muted-foreground">
                        Kode: {item.product_sku}
                      </span>
                    </div>
                    {variantLabel ? (
                      <div className="mt-1 text-xs text-muted-foreground">
                        {variantLabel}
                      </div>
                    ) : null}
                    {!item.in_stock ? (
                      <div className="mt-2 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded w-fit">
                        Stok habis
                      </div>
                    ) : null}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="block font-bold text-lg text-foreground">
                      {formatCurrency(item.price)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg overflow-hidden h-9">
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-3 h-full bg-muted/40 hover:bg-muted text-muted-foreground border-r border-border transition rounded-none"
                        onClick={() =>
                          onQuantityChange(item.id, clampQty(item, item.quantity - 1))
                        }
                        disabled={item.quantity <= 1 || updatingId === item.id}
                      >
                        <span className="material-icons-outlined text-sm">remove</span>
                      </Button>
                      <Input
                        readOnly
                        tabIndex={-1}
                        type="text"
                        value={item.quantity}
                        className="w-10 h-full text-center border-none focus-visible:ring-0 bg-card text-foreground font-medium text-sm p-0"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-3 h-full bg-muted/40 hover:bg-muted text-muted-foreground border-l border-border transition rounded-none"
                        onClick={() =>
                          onQuantityChange(item.id, clampQty(item, item.quantity + 1))
                        }
                        disabled={
                          (item.track_stock && item.quantity >= item.stock) ||
                          updatingId === item.id
                        }
                      >
                        <span className="material-icons-outlined text-sm">add</span>
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-muted-foreground hover:text-destructive transition flex items-center gap-1 text-sm font-medium h-auto px-0"
                      title="Hapus item"
                      disabled={removingId === item.id}
                      onClick={() => onRemove(item.id)}
                    >
                      <span className="material-icons-outlined text-lg">delete</span>
                      <span className="hidden sm:inline">Hapus</span>
                    </Button>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground block mb-0.5">
                      Subtotal
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
