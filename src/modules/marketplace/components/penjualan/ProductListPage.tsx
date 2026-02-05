/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductListHeader } from "./ProductListHeader";
import { ProductTable } from "./ProductTable";
import { ProductPagination } from "./ProductPagination";
import { ProductFilterSheet } from "./ProductFilterSheet";
import type { ProductListItem } from "@/modules/marketplace/types";
import {
  useInventoryActions,
  useInventoryCategories,
  useInventoryProducts,
} from "@/hooks/queries/inventory";
import { mapInventoryProduct } from "@/modules/inventory/utils";

const PAGE_SIZE = 10;
const DEFAULT_PRODUCT_STATUSES = ["Tersedia", "Menipis", "Habis"] as const;

const resolveStockStatus = (stock: number, minStock?: number, trackStock?: boolean) => {
  if (!trackStock) return "Tersedia";
  if (stock <= 0) return "Habis";
  if (typeof minStock === "number" && stock <= minStock) return "Menipis";
  return "Tersedia";
};

export function ProductListPage() {
  const router = useRouter();
  const actions = useInventoryActions();
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [appliedFilters, setAppliedFilters] = useState(() => ({
    categories: [] as string[],
    statuses: [] as string[],
    minPrice: "",
    maxPrice: "",
    dateFrom: "",
    dateTo: "",
  }));
  const [draftFilters, setDraftFilters] = useState(appliedFilters);
  const [page, setPage] = useState(1);
  const { data: categoriesData } = useInventoryCategories();

  useEffect(() => {
    if (filterOpen) {
      setDraftFilters(appliedFilters);
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

  const minPriceValue = Number(appliedFilters.minPrice);
  const maxPriceValue = Number(appliedFilters.maxPrice);

  const { data, isLoading, isError } = useInventoryProducts({
    q: searchValue || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
    categories:
      appliedFilters.categories.length > 0
        ? appliedFilters.categories.join(",")
        : undefined,
    stock_status: statusParam || undefined,
    min_price: Number.isFinite(minPriceValue) ? minPriceValue : undefined,
    max_price: Number.isFinite(maxPriceValue) ? maxPriceValue : undefined,
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
        status: resolveStockStatus(item.stock, item.minStock, item.trackStock),
        stockCount: item.trackStock ? item.stock : 0,
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
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((item) => item.id) : []);
  };

  const handleToggleCategory = (label: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(label)
        ? prev.categories.filter((item) => item !== label)
        : [...prev.categories, label],
    }));
  };

  const handleToggleStatus = (label: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      statuses: prev.statuses.includes(label)
        ? prev.statuses.filter((item) => item !== label)
        : [...prev.statuses, label],
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
    setDraftFilters(reset);
    setAppliedFilters(reset);
    setPage(1);
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setFilterOpen(false);
    setPage(1);
  };

  const total = data?.total ?? products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, total);

  return (
    <div className="space-y-6">
      <ProductListHeader
        searchValue={searchValue}
        onSearchChange={(value) => {
          setSearchValue(value);
          setPage(1);
        }}
        onOpenFilter={() => setFilterOpen(true)}
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
                ? "Sembunyikan Marketplace"
                : "Tampilkan Marketplace",
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
      />

      <ProductPagination
        page={page}
        totalPages={totalPages}
        from={rangeStart}
        to={rangeEnd}
        total={total}
        onPageChange={setPage}
      />

      <ProductFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
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
