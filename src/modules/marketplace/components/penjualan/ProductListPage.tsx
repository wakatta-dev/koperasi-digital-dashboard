/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductListHeader } from "./ProductListHeader";
import { ProductTable } from "./ProductTable";
import { ProductPagination } from "./ProductPagination";
import { ProductFilterSheet } from "./ProductFilterSheet";
const DEFAULT_PRODUCT_STATUSES = ["Tersedia", "Menipis", "Habis"] as const;
import type { ProductListItem } from "@/modules/marketplace/types";
import { useInventoryActions, useInventoryProducts } from "@/hooks/queries/inventory";
import { mapInventoryProduct } from "@/modules/inventory/utils";

const PAGE_SIZE = 10;

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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useInventoryProducts({
    q: searchValue || undefined,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
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
    const dynamic = new Set(
      products
        .map((product) => product.category)
        .filter((category) => category && category !== "-")
    );
    return Array.from(dynamic).map((label) => ({
      label,
      checked: selectedCategories.includes(label),
    }));
  }, [products, selectedCategories]);

  const statusOptions = useMemo(() => {
    const dynamic = new Set(products.map((product) => product.status));
    const labels =
      dynamic.size > 0 ? Array.from(dynamic) : [...DEFAULT_PRODUCT_STATUSES];
    return labels.map((label) => ({
      label,
      checked: selectedStatuses.includes(label),
    }));
  }, [products, selectedStatuses]);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleAll = (checked: boolean) => {
    setSelectedIds(checked ? products.map((item) => item.id) : []);
  };

  const handleToggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleToggleStatus = (label: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    );
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setSelectedStatuses([]);
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
        onToggleCategory={handleToggleCategory}
        onToggleStatus={handleToggleStatus}
        onReset={handleResetFilters}
        onApply={() => setFilterOpen(false)}
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
