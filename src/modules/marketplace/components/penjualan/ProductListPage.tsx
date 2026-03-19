/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductListHeader } from "./ProductListHeader";
import { ProductTable } from "./ProductTable";
import { ProductFilterSheet } from "./ProductFilterSheet";
import type { ProductListItem } from "@/modules/marketplace/types";
import {
  useInventoryActions,
  useInventoryCategories,
  useInventoryProducts,
} from "@/hooks/queries/inventory";
import { mapInventoryProduct } from "@/modules/inventory/utils";
import { parseOptionalPriceFilter } from "./product-list-filters";

const PAGE_SIZE = 10;
const DEFAULT_PRODUCT_STATUSES = ["Tersedia", "Menipis", "Habis"] as const;

const resolveStockStatus = (
  stock: number,
  minStock?: number,
  trackStock?: boolean,
  hasVariants?: boolean,
  variantInStock?: boolean,
  variantPriceValid?: boolean,
) => {
  if (hasVariants) {
    if (!variantPriceValid || !variantInStock) return "Habis";
    return "Tersedia";
  }
  if (!trackStock) return "Tersedia";
  if (stock <= 0) return "Habis";
  if (typeof minStock === "number" && stock <= minStock) return "Menipis";
  return "Tersedia";
};

type ProductListPageProps = {
  createdProductId?: string;
};

export function ProductListPage({
  createdProductId,
}: ProductListPageProps = {}) {
  const router = useRouter();
  const actions = useInventoryActions();
  const [uiState, setUiState] = useState(() => ({
    searchValue: "",
    filterOpen: false,
    selectedIds: [] as string[],
    appliedFilters: {
      categories: [] as string[],
      statuses: [] as string[],
      minPrice: "",
      maxPrice: "",
      dateFrom: "",
      dateTo: "",
    },
    draftFilters: {
      categories: [] as string[],
      statuses: [] as string[],
      minPrice: "",
      maxPrice: "",
      dateFrom: "",
      dateTo: "",
    },
    page: 1,
  }));
  const {
    searchValue,
    filterOpen,
    selectedIds,
    appliedFilters,
    draftFilters,
    page,
  } = uiState;
  const patchUiState = (
    updates: Partial<typeof uiState> | ((current: typeof uiState) => typeof uiState),
  ) => {
    setUiState((current) =>
      typeof updates === "function" ? updates(current) : { ...current, ...updates },
    );
  };
  const { data: categoriesData } = useInventoryCategories();

  useEffect(() => {
    if (!createdProductId || !searchValue) return;
    patchUiState((current) => ({
      ...current,
      searchValue: "",
      page: 1,
      selectedIds: [],
      appliedFilters: {
        categories: [],
        statuses: [],
        minPrice: "",
        maxPrice: "",
        dateFrom: "",
        dateTo: "",
      },
      draftFilters: {
        categories: [],
        statuses: [],
        minPrice: "",
        maxPrice: "",
        dateFrom: "",
        dateTo: "",
      },
    }));
  }, [createdProductId, searchValue]);

  useEffect(() => {
    if (filterOpen) {
      patchUiState((current) => ({
        ...current,
        draftFilters: current.appliedFilters,
      }));
    }
  }, [filterOpen, appliedFilters]);

  const statusParam = useMemo(() => {
    const map: Record<string, string> = {
      Tersedia: "available",
      Menipis: "low",
      Habis: "out",
    };
    return appliedFilters.statuses
      .map((status) => map[status])
      .filter(Boolean)
      .join(",");
  }, [appliedFilters.statuses]);

  const minPriceValue = parseOptionalPriceFilter(appliedFilters.minPrice);
  const maxPriceValue = parseOptionalPriceFilter(appliedFilters.maxPrice);

  const { data, isLoading, isError } = useInventoryProducts({
    q: searchValue || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    categories:
      appliedFilters.categories.length > 0
        ? appliedFilters.categories.join(",")
        : undefined,
    stock_status: statusParam || undefined,
    min_price: minPriceValue,
    max_price: maxPriceValue,
    start_date: appliedFilters.dateFrom || undefined,
    end_date: appliedFilters.dateTo || undefined,
  });

  const inventoryItems = useMemo(() => {
    if (!data?.items?.length) return [];
    return data.items.map((product) => mapInventoryProduct(product));
  }, [data?.items]);

  const products: ProductListItem[] = useMemo(
    () =>
      inventoryItems.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        category: item.category ?? "-",
        internalStatus: item.status,
        marketplaceLabel:
          item.status !== "ACTIVE"
            ? "Produk diarsipkan"
            : item.showInMarketplace
              ? "Tayang di marketplace"
              : "Draft internal",
        sellerLabel: item.sellerId ? `Seller #${item.sellerId}` : "Tanpa seller",
        status: resolveStockStatus(
          item.stock,
          item.minStock,
          item.trackStock,
          item.product.has_variants,
          item.product.variant_in_stock,
          item.product.variant_price_valid,
        ),
        stockCount: item.product.has_variants ? item.stock : item.trackStock ? item.stock : 0,
        price: item.price,
        thumbnailUrl: item.image,
      })),
    [inventoryItems]
  );

  const categoryOptions = useMemo(() => {
    const fromApi = (categoriesData ?? [])
      .map((category) => category.name)
      .filter((name): name is string => Boolean(name));
    const fromProducts = products
      .map((product) => product.category)
      .filter((category): category is string => Boolean(category && category !== "-"));
    const labels = Array.from(
      new Set([...fromApi, ...fromProducts, ...draftFilters.categories])
    );
    return labels.map((label) => ({
      label,
      checked: draftFilters.categories.includes(label),
    }));
  }, [categoriesData, products, draftFilters.categories]);

  const statusOptions = useMemo(() => {
    const dynamic = new Set(products.map((product) => product.status));
    const labels =
      dynamic.size > 0 ? Array.from(dynamic) : [...DEFAULT_PRODUCT_STATUSES];
    return labels.map((label) => ({
      label,
      checked: draftFilters.statuses.includes(label),
    }));
  }, [products, draftFilters.statuses]);

  const handleToggleSelect = (id: string) => {
    patchUiState((current) => ({
      ...current,
      selectedIds: current.selectedIds.includes(id)
        ? current.selectedIds.filter((item) => item !== id)
        : [...current.selectedIds, id],
    }));
  };

  const handleToggleAll = (checked: boolean) => {
    patchUiState({
      selectedIds: checked ? products.map((item) => item.id) : [],
    });
  };

  const handleToggleCategory = (label: string) => {
    patchUiState((current) => ({
      ...current,
      draftFilters: {
        ...current.draftFilters,
        categories: current.draftFilters.categories.includes(label)
          ? current.draftFilters.categories.filter((item) => item !== label)
          : [...current.draftFilters.categories, label],
      },
    }));
  };

  const handleToggleStatus = (label: string) => {
    patchUiState((current) => ({
      ...current,
      draftFilters: {
        ...current.draftFilters,
        statuses: current.draftFilters.statuses.includes(label)
          ? current.draftFilters.statuses.filter((item) => item !== label)
          : [...current.draftFilters.statuses, label],
      },
    }));
  };

  const handleResetFilters = () => {
    const reset = {
      categories: [],
      statuses: [],
      minPrice: "",
      maxPrice: "",
      dateFrom: "",
      dateTo: "",
    };
    patchUiState({
      draftFilters: reset,
      appliedFilters: reset,
      page: 1,
    });
  };

  const handleApplyFilters = () => {
    patchUiState({
      appliedFilters: draftFilters,
      filterOpen: false,
      page: 1,
    });
  };

  const total = data?.total ?? products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div
      className="space-y-6"
      data-testid="marketplace-admin-inventory-page-root"
    >
      <ProductListHeader
        searchValue={searchValue}
        onSearchChange={(value) => {
          patchUiState({ searchValue: value, page: 1 });
        }}
        onOpenFilter={() => patchUiState({ filterOpen: true })}
        onAddProduct={() => router.push("/bumdes/marketplace/inventory/create")}
      />

      <ProductTable
        products={products}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleAll={handleToggleAll}
        onRowClick={(product) => router.push(`/bumdes/marketplace/inventory/${product.id}`)}
        getActions={(product) => {
          const inventoryItem = inventoryItems.find((item) => item.id === product.id);
          if (!inventoryItem) return [];
          const actionsList = [
            {
              label: "Lihat Detail",
              onSelect: () => router.push(`/bumdes/marketplace/inventory/${product.id}`),
            },
            inventoryItem.status !== "ARCHIVED"
              ? {
                  label: "Arsipkan",
                  tone: "destructive" as const,
                  onSelect: () => actions.archive.mutate(inventoryItem.id),
                }
              : {
                  label: "Aktifkan",
                  onSelect: () => actions.unarchive.mutate(inventoryItem.id),
                },
            {
              label: inventoryItem.showInMarketplace
                ? "Sembunyikan dari Marketplace"
                : "Publikasikan ke Marketplace",
              onSelect: () =>
                actions.update.mutate({
                  id: inventoryItem.id,
                  payload: { show_in_marketplace: !inventoryItem.showInMarketplace },
                }),
              disabled: inventoryItem.status !== "ACTIVE",
            },
          ];
          return actionsList;
        }}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalItems: total,
          totalPages,
        }}
        paginationInfo={`Menampilkan ${rangeStart}-${rangeEnd} dari ${total} produk`}
        onPageChange={(nextPage) => patchUiState({ page: nextPage })}
      />

      <ProductFilterSheet
        open={filterOpen}
        onOpenChange={(open) => patchUiState({ filterOpen: open })}
        categories={categoryOptions}
        statuses={statusOptions}
        minPrice={draftFilters.minPrice}
        maxPrice={draftFilters.maxPrice}
        dateFrom={draftFilters.dateFrom}
        dateTo={draftFilters.dateTo}
        onToggleCategory={handleToggleCategory}
        onToggleStatus={handleToggleStatus}
        onMinPriceChange={(value) =>
          setDraftFilters((prev) => ({ ...prev, minPrice: value }))
        }
        onMaxPriceChange={(value) =>
          setDraftFilters((prev) => ({ ...prev, maxPrice: value }))
        }
        onDateFromChange={(value) =>
          setDraftFilters((prev) => ({ ...prev, dateFrom: value }))
        }
        onDateToChange={(value) =>
          setDraftFilters((prev) => ({ ...prev, dateTo: value }))
        }
        onReset={handleResetFilters}
        onApply={handleApplyFilters}
      />

      {isLoading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Memuat data inventaris...</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-red-500">Gagal memuat data inventaris.</p>
      ) : null}
    </div>
  );
}
