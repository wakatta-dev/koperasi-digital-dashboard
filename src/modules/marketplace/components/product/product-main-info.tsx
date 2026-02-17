/** @format */

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useCartMutations } from "../../hooks/useMarketplaceProducts";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { MarketplaceProductDetail } from "../../constants";
import type { MarketplaceVariantGroupResponse } from "@/types/api/marketplace";
import { animateFlyToCart } from "../../utils/fly-to-cart";

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

const normalizeAttributeKey = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/_/g, " ")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase();

type FlatVariantOption = {
  id: number;
  sku: string;
  attributes?: Record<string, string>;
  price: number;
  stock: number;
  track_stock: boolean;
  variant_group_id: number;
};

const GROUP_ATTRIBUTE_SYNONYMS: Record<string, string[]> = {
  warna: ["color", "colour"],
  ukuran: ["size"],
  rasa: ["flavor", "flavour"],
};

const getAttributeValueByKey = (
  attributes: Record<string, string> | undefined,
  key: string | undefined
) => {
  if (!attributes || !key) {
    return "";
  }
  const target = normalizeAttributeKey(key);
  for (const [rawKey, rawValue] of Object.entries(attributes)) {
    if (normalizeAttributeKey(rawKey) === target) {
      return rawValue.trim();
    }
  }
  return "";
};

const resolveGroupAttributeKeys = (
  groups: MarketplaceVariantGroupResponse[],
  options: FlatVariantOption[]
) => {
  const availableAttrKeyMap = new Map<string, string>();
  for (const option of options) {
    for (const rawKey of Object.keys(option.attributes ?? {})) {
      const normalized = normalizeAttributeKey(rawKey);
      if (normalized && !availableAttrKeyMap.has(normalized)) {
        availableAttrKeyMap.set(normalized, rawKey);
      }
    }
  }

  const resolved = new Map<number, string>();
  const usedNormalized = new Set<string>();
  for (const group of groups) {
    const normalizedName = normalizeAttributeKey(group.name);
    const directCandidates = [
      normalizedName,
      ...(GROUP_ATTRIBUTE_SYNONYMS[normalizedName] ?? []),
    ];

    let matched: string | undefined;
    for (const candidate of directCandidates) {
      if (availableAttrKeyMap.has(candidate) && !usedNormalized.has(candidate)) {
        matched = candidate;
        break;
      }
    }
    if (!matched) {
      for (const candidate of availableAttrKeyMap.keys()) {
        if (usedNormalized.has(candidate)) {
          continue;
        }
        if (candidate.includes(normalizedName) || normalizedName.includes(candidate)) {
          matched = candidate;
          break;
        }
      }
    }
    if (!matched) {
      matched = [...availableAttrKeyMap.keys()].find(
        (candidate) => !usedNormalized.has(candidate)
      );
    }
    if (matched) {
      usedNormalized.add(matched);
      resolved.set(group.id, availableAttrKeyMap.get(matched) ?? matched);
    }
  }

  return resolved;
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
  const [selectedValuesByGroupId, setSelectedValuesByGroupId] = useState<
    Record<number, string>
  >({});
  const flatOptions = useMemo<FlatVariantOption[]>(
    () =>
      activeVariantState
        ? activeVariantState.groups.flatMap((group) =>
            (group.options ?? []).map((option) => ({
              ...option,
              variant_group_id: group.id,
            }))
          )
        : [],
    [activeVariantState]
  );
  const selectedOption = useMemo(
    () =>
      activeVariantState
        ? flatOptions.find(
            (option) => option.id === activeVariantState.selectedOptionId
          ) ?? null
        : null,
    [activeVariantState, flatOptions]
  );
  const selectedOptionGroupId = selectedOption?.variant_group_id;
  const groupAttributeKeyMap = useMemo(
    () =>
      activeVariantState
        ? resolveGroupAttributeKeys(activeVariantState.groups, flatOptions)
        : new Map<number, string>(),
    [activeVariantState, flatOptions]
  );
  const requiredGroupIDs = useMemo(
    () =>
      activeVariantState
        ? activeVariantState.groups
            .filter((group) => groupAttributeKeyMap.has(group.id))
            .map((group) => group.id)
        : [],
    [activeVariantState, groupAttributeKeyMap]
  );

  useEffect(() => {
    setSelectedValuesByGroupId({});
  }, [product.id]);

  useEffect(() => {
    if (!activeVariantState || !selectedOption) {
      return;
    }
    const nextValues: Record<number, string> = {};
    for (const group of activeVariantState.groups) {
      const key = groupAttributeKeyMap.get(group.id);
      const value = getAttributeValueByKey(selectedOption.attributes, key);
      if (value) {
        nextValues[group.id] = value;
      }
    }
    setSelectedValuesByGroupId((prev) => ({ ...prev, ...nextValues }));
  }, [activeVariantState, selectedOption, groupAttributeKeyMap]);

  const getMatchingOptions = (selectedValues: Record<number, string>) => {
    if (!activeVariantState) {
      return [];
    }
    return flatOptions.filter((option) =>
      activeVariantState.groups.every((group) => {
        const key = groupAttributeKeyMap.get(group.id);
        if (!key) {
          return true;
        }
        const wanted = selectedValues[group.id];
        if (!wanted) {
          return true;
        }
        return getAttributeValueByKey(option.attributes, key) === wanted;
      })
    );
  };

  const groupValueCountMap = useMemo(() => {
    if (!activeVariantState) {
      return new Map<number, number>();
    }
    const counts = new Map<number, number>();
    for (const group of activeVariantState.groups) {
      const key = groupAttributeKeyMap.get(group.id);
      if (!key) {
        counts.set(group.id, 0);
        continue;
      }
      const uniqueValues = new Set<string>();
      for (const option of flatOptions) {
        const value = getAttributeValueByKey(option.attributes, key);
        if (value) {
          uniqueValues.add(value);
        }
      }
      counts.set(group.id, uniqueValues.size);
    }
    return counts;
  }, [activeVariantState, flatOptions, groupAttributeKeyMap]);

  const groupValueItemsByGroup = useMemo(() => {
    const result = new Map<
      number,
      Array<{
        value: string;
        selected: boolean;
        disabled: boolean;
        inStock: boolean;
      }>
    >();

    if (!activeVariantState) {
      return result;
    }

    for (const group of activeVariantState.groups) {
      const groupKey = groupAttributeKeyMap.get(group.id);
      if (!groupKey) {
        result.set(group.id, []);
        continue;
      }

      const uniqueValues = new Set<string>();
      for (const option of flatOptions) {
        const value = getAttributeValueByKey(option.attributes, groupKey);
        if (value) {
          uniqueValues.add(value);
        }
      }

      const items = [...uniqueValues]
        .sort((a, b) => a.localeCompare(b, "id", { sensitivity: "base" }))
        .map((value) => {
          const nextSelectedValues = { ...selectedValuesByGroupId, [group.id]: value };
          const matches = getMatchingOptions(nextSelectedValues);
          const inStock = matches.some(
            (option) => !option.track_stock || option.stock > 0
          );
          return {
            value,
            selected: selectedValuesByGroupId[group.id] === value,
            disabled: matches.length === 0,
            inStock,
          };
        });

      result.set(group.id, items);
    }

    return result;
  }, [
    activeVariantState,
    flatOptions,
    groupAttributeKeyMap,
    selectedValuesByGroupId,
  ]);

  const handleSelectVariantValue = (groupId: number, value: string) => {
    if (!activeVariantState) {
      return;
    }

    const nextValues = { ...selectedValuesByGroupId, [groupId]: value };
    setSelectedValuesByGroupId(nextValues);

    const selectionComplete =
      requiredGroupIDs.length === 0 ||
      requiredGroupIDs.every((id) => Boolean(nextValues[id]));
    if (!selectionComplete) {
      activeVariantState.onSelectGroup(groupId);
      return;
    }

    const candidates = getMatchingOptions(nextValues);
    if (candidates.length === 0) {
      activeVariantState.onSelectGroup(groupId);
      return;
    }

    const chosen =
      candidates.find((option) => option.id === activeVariantState.selectedOptionId) ??
      candidates.find((option) => !option.track_stock || option.stock > 0) ??
      candidates[0];
    if (chosen) {
      activeVariantState.onSelectOption(chosen.id);
    }
  };

  const stockCap = Number(product.availableStock);
  const maxQty =
    Number.isFinite(stockCap) && stockCap > 0
      ? Math.max(1, stockCap)
      : product.trackStock
      ? 1
      : undefined;
  const clamp = (val: number) => {
    if (maxQty !== undefined) {
      return Math.min(Math.max(1, val), maxQty);
    }
    return Math.max(1, val);
  };
  useEffect(() => {
    setQuantity((prev) => clamp(prev));
  }, [maxQty]);

  const canDecrease = quantity > 1;
  const canIncrease = maxQty === undefined || quantity < maxQty;
  const variantSelectionComplete =
    !activeVariantState ||
    requiredGroupIDs.length === 0 ||
    requiredGroupIDs.every((id) => Boolean(selectedValuesByGroupId[id]));
  const canAddToCartEffective = canAddToCart && variantSelectionComplete;

  const decrease = () => setQuantity((prev) => clamp(prev - 1));
  const increase = () => setQuantity((prev) => clamp(prev + 1));

  const handleAdd = async () => {
    const qty = clamp(quantity);
    if (activeVariantState && !variantSelectionComplete) {
      showToastError("Pilih varian", "Silakan pilih varian terlebih dahulu");
      return;
    }
    if (!priceAvailable) {
      showToastError("Harga belum tersedia", "Silakan pilih varian lain.");
      return;
    }
    if (!canAddToCartEffective) {
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
      if (selectedOptionGroupId) {
        payload.variant_group_id = selectedOptionGroupId;
      } else if (activeVariantState.selectedGroupId) {
        payload.variant_group_id = activeVariantState.selectedGroupId;
      }
      if (activeVariantState.selectedOptionId) {
        payload.variant_option_id = activeVariantState.selectedOptionId;
      }
    }
    addItem.mutate(
      payload,
      {
        onSuccess: () => {
          animateFlyToCart(actionBtnRef.current);
          showToastSuccess("Berhasil", "Produk ditambahkan ke keranjang.");
        },
        onError: (err: any) =>
          showToastError("Gagal menambahkan ke keranjang", err),
      }
    );
  };

  return (
    <div
      className="bg-card rounded-2xl shadow-sm border border-border p-6 lg:p-8 flex-grow"
      data-testid="marketplace-product-detail-main-info"
    >
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
            data-testid="marketplace-product-detail-visit-store-button"
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

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
          {activeVariantState ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {product.variantLabel}
                </label>
                <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-3">
                  {activeVariantState.groups.map((group) => {
                    const valueItems = groupValueItemsByGroup.get(group.id) ?? [];
                    return (
                      <div key={group.id} className="rounded-lg border border-border/80 bg-card p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-semibold text-foreground">{group.name}</p>
                          <span className="text-xs text-muted-foreground">
                            {valueItems.length} opsi
                          </span>
                        </div>
                        {valueItems.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {valueItems.map((item) => (
                              <button
                                key={`${group.id}-${item.value}`}
                                data-testid={`marketplace-product-detail-variant-option-${group.id}-${item.value}`}
                                type="button"
                                aria-pressed={item.selected}
                                disabled={item.disabled}
                                onClick={() => handleSelectVariantValue(group.id, item.value)}
                                className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                                  item.selected
                                    ? "border-indigo-500 bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300"
                                    : "border-border bg-background text-foreground hover:border-indigo-400"
                                } ${
                                  item.disabled
                                    ? "cursor-not-allowed opacity-45"
                                    : ""
                                }`}
                                title={
                                  item.disabled
                                    ? "Kombinasi varian ini tidak tersedia"
                                    : undefined
                                }
                              >
                                {item.value}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">
                            Opsi untuk grup ini belum tersedia.
                          </p>
                        )}
                        {valueItems.some((item) => item.selected && !item.inStock) ? (
                          <p className="mt-2 text-xs text-destructive">
                            Nilai terpilih tidak memiliki stok.
                          </p>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              {selectedOption ? (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-2 text-xs text-indigo-700 dark:border-indigo-900/40 dark:bg-indigo-900/20 dark:text-indigo-300">
                  Pilihan aktif:{" "}
                  {formatAttributeLabel(selectedOption.attributes) || selectedOption.sku}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
                  Pilih kombinasi varian sesuai kebutuhan Anda.
                </div>
              )}
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
            <div className="flex items-center overflow-hidden rounded-xl border border-border bg-card">
              <button
                data-testid="marketplace-product-detail-quantity-decrease-button"
                type="button"
                onClick={decrease}
                disabled={!canDecrease}
                className="h-11 w-11 border-r border-border bg-muted/30 text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-icons-outlined text-sm">remove</span>
              </button>
              <input
                data-testid="marketplace-product-detail-quantity-input"
                type="text"
                value={quantity}
                readOnly
                className="w-14 border-none bg-card text-center text-base font-semibold text-foreground focus:ring-0"
              />
              <button
                data-testid="marketplace-product-detail-quantity-increase-button"
                type="button"
                onClick={increase}
                disabled={!canIncrease}
                className="h-11 w-11 border-l border-border bg-muted/30 text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-icons-outlined text-sm">add</span>
              </button>
            </div>
            <p
              className={`mt-1 text-xs ${
                canAddToCartEffective ? "text-muted-foreground" : "text-destructive"
              }`}
            >
              {product.stock}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            data-testid="marketplace-product-detail-buy-now-button"
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2 h-auto"
            ref={actionBtnRef}
            disabled={!canAddToCartEffective}
            onClick={handleAdd}
          >
            <span className="material-icons-outlined text-xl">
              shopping_bag
            </span>
            Beli Sekarang
          </Button>
          <Button
            data-testid="marketplace-product-detail-add-to-cart-button"
            variant="outline"
            className="flex-1 border border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-6 py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 h-auto"
            disabled={!canAddToCartEffective}
            onClick={handleAdd}
          >
            <span className="material-icons-outlined text-xl">
              add_shopping_cart
            </span>
            Keranjang
          </Button>
          <Button
            data-testid="marketplace-product-detail-add-to-wishlist-button"
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
