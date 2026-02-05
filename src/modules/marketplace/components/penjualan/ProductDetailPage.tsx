/** @format */

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDetailHeader } from "./ProductDetailHeader";
import { ProductMediaCard } from "./ProductMediaCard";
import { ProductBasicInfoCard } from "./ProductBasicInfoCard";
import { ProductStatsCards } from "./ProductStatsCards";
import { ProductVariantsTable } from "./ProductVariantsTable";
import { ProductInventoryHistory } from "./ProductInventoryHistory";
import { ProductDeleteModal } from "./ProductDeleteModal";
import { ProductInventoryHistoryModal } from "./ProductInventoryHistoryModal";
import {
  useInventoryActions,
  useInventoryProduct,
  useInventoryProductStats,
  useInventoryStockHistory,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import { mapInventoryProduct } from "@/modules/inventory/utils";
import type { InventoryEvent, ProductStatus, ProductVariant } from "@/modules/marketplace/types";

export type ProductDetailPageProps = Readonly<{
  id: string;
}>;

const resolveStockStatus = (stock: number, minStock?: number, trackStock?: boolean): ProductStatus => {
  if (!trackStock) return "Tersedia";
  if (stock <= 0) return "Habis";
  if (typeof minStock === "number" && stock <= minStock) return "Menipis";
  return "Tersedia";
};

const formatHistoryTimestamp = (timestamp: number) => {
  if (!timestamp) return "-";
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return `${date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })} WIB`;
};

export function ProductDetailPage({ id }: ProductDetailPageProps) {
  const actions = useInventoryActions();
  const router = useRouter();
  const { data, isLoading, isError, error } = useInventoryProduct(id);
  const { data: stats } = useInventoryProductStats(id);
  const { data: variantsData } = useInventoryVariants(id);
  const [historyRange, setHistoryRange] = useState("7d");
  const { data: historyData } = useInventoryStockHistory(id, {
    range: historyRange,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const item = useMemo(() => (data ? mapInventoryProduct(data) : null), [data]);

  const variants: ProductVariant[] = useMemo(() => {
    if (!variantsData) return [];
    const groups = new Map(
      (variantsData.variant_groups ?? []).map((group) => [group.id, group.name])
    );
    return (variantsData.options ?? []).map((option) => {
      const groupName = groups.get(option.variant_group_id) ?? "Varian";
      const attributes = option.attributes ?? {};
      const attributeLabel = Object.values(attributes).join(" / ");
      return {
        name: attributeLabel ? `${groupName} / ${attributeLabel}` : groupName,
        sku: option.sku,
        stock: option.stock,
        price: option.price_override ?? item?.price ?? 0,
      };
    });
  }, [variantsData, item?.price]);

  const history: InventoryEvent[] = useMemo(() => {
    if (!historyData) return [];
    return historyData.map((entry) => ({
      id: String(entry.id),
      title: entry.reference || entry.note || "Perubahan stok",
      timestamp: formatHistoryTimestamp(entry.timestamp),
      timestampValue: entry.timestamp ? entry.timestamp * 1000 : undefined,
      delta: entry.quantity,
      remainingStock: entry.balance,
      type: entry.quantity >= 0 ? "increase" : "decrease",
    }));
  }, [historyData]);

  if (isLoading) {
    return <p className="text-sm text-gray-500 dark:text-gray-400">Memuat detail produk...</p>;
  }

  if (isError || !item) {
    return (
      <p className="text-sm text-red-500">
        {error instanceof Error ? error.message : "Gagal memuat detail produk."}
      </p>
    );
  }

  const status = resolveStockStatus(item.stock, item.minStock, item.trackStock);
  const mediaImages =
    item.images && item.images.length > 0
      ? [...item.images]
          .sort(
            (a, b) =>
              Number(b.is_primary) - Number(a.is_primary) ||
              a.sort_order - b.sort_order
          )
          .map((image) => image.url)
      : item.image
        ? [item.image]
        : [];

  return (
    <div className="space-y-6">
      <ProductDetailHeader
        name={item.name}
        sku={item.sku}
        status={status}
        onDelete={() => setDeleteOpen(true)}
        onEdit={() => router.push(`/bumdes/marketplace/inventory/${id}/edit`)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ProductMediaCard name={item.name} images={mediaImages} />
          <ProductBasicInfoCard
            category={item.category ?? "-"}
            brand={item.brand ?? "-"}
            description={item.description ?? "-"}
            weightKg={item.weightKg ?? undefined}
          />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <ProductStatsCards
            price={item.price}
            stockCount={item.stock}
            minStockAlert={item.minStock ?? 0}
            totalSold={stats?.total_sold ?? 0}
            soldLast30Days={stats?.sold_last_30_days ?? undefined}
            salesChangePercent={stats?.sales_change_percent ?? undefined}
          />
          <ProductVariantsTable
            variants={variants}
            onAddVariant={() =>
              router.push(`/bumdes/marketplace/inventory/${id}/variants`)
            }
            onEditVariant={() =>
              router.push(`/bumdes/marketplace/inventory/${id}/variants`)
            }
          />
          <ProductInventoryHistory
            entries={history}
            range={historyRange}
            onRangeChange={setHistoryRange}
            onViewAll={() => setHistoryOpen(true)}
          />
        </div>
      </div>

      <ProductInventoryHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        productName={item.name}
        sku={item.sku}
        entries={history}
      />
      <ProductDeleteModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        productName={item.name}
        onConfirm={() => actions.archive.mutate(item.id)}
      />
    </div>
  );
}
