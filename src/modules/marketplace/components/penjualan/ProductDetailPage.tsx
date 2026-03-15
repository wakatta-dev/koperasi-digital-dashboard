/** @format */

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ensureSuccess } from "@/lib/api";
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
  useInventoryVariantActions,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import {
  computeMarketplacePublicationReadiness,
  mapInventoryProduct,
} from "@/modules/inventory/utils";
import {
  createMarketplaceListingSubmission,
  getMarketplaceListingChannels,
  getMarketplaceListingSubmission,
  reviewMarketplaceListingSubmission,
  updateMarketplaceListingChannel,
} from "@/services/api/marketplace";
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
  const variantActions = useInventoryVariantActions();
  const queryClient = useQueryClient();
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
  const [uploadingVariantId, setUploadingVariantId] = useState<number | null>(null);

  const item = useMemo(() => (data ? mapInventoryProduct(data) : null), [data]);
  const listingId = item?.listingId;
  const submissionQuery = useQuery({
    queryKey: ["marketplace-listing-submission", listingId],
    enabled: Boolean(listingId),
    queryFn: async () =>
      ensureSuccess(await getMarketplaceListingSubmission(listingId as string | number)),
  });
  const channelsQuery = useQuery({
    queryKey: ["marketplace-listing-channels", listingId],
    enabled: Boolean(listingId),
    queryFn: async () =>
      ensureSuccess(await getMarketplaceListingChannels(listingId as string | number)),
  });
  const invalidateListingQueries = async () => {
    if (!listingId) return;
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["marketplace-listing-submission", listingId] }),
      queryClient.invalidateQueries({ queryKey: ["marketplace-listing-channels", listingId] }),
      queryClient.invalidateQueries({ queryKey: ["inventory-detail", id] }),
      queryClient.invalidateQueries({ queryKey: ["inventory"] }),
    ]);
  };
  const submitForReviewMutation = useMutation({
    mutationFn: async () =>
      ensureSuccess(
        await createMarketplaceListingSubmission(listingId as string | number, {
          seller_id: Number(item?.sellerId),
          inventory_product_id: Number(id),
        }),
      ),
    onSuccess: async () => {
      await invalidateListingQueries();
      toast.success("Submission produk berhasil diajukan untuk review.");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengajukan review produk."),
  });
  const reviewSubmissionMutation = useMutation({
    mutationFn: async (decision: "approved" | "held_for_revision" | "rejected") =>
      ensureSuccess(
        await reviewMarketplaceListingSubmission(listingId as string | number, {
          decision,
          mapped_inventory_product_id: Number(id),
        }),
      ),
    onSuccess: async (_data, decision) => {
      await invalidateListingQueries();
      toast.success(`Submission berhasil diubah ke status ${decision}.`);
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui review submission."),
  });
  const updateChannelMutation = useMutation({
    mutationFn: async (vars: { channel: string; state: string; blockerCode?: string }) =>
      ensureSuccess(
        await updateMarketplaceListingChannel(listingId as string | number, vars.channel, {
          publishability_state: vars.state,
          blocker_code: vars.blockerCode,
        }),
      ),
    onSuccess: async () => {
      await invalidateListingQueries();
      toast.success("Publishability channel diperbarui.");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui publishability channel."),
  });
  const publicationReadiness = useMemo(
    () =>
      data
        ? computeMarketplacePublicationReadiness(data, { requireImage: true })
        : { ready: false, reasons: [] as string[] },
    [data],
  );

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
        optionId: option.id,
        name: attributeLabel ? `${groupName} / ${attributeLabel}` : groupName,
        sku: option.sku,
        stock: option.stock,
        price: option.price_override ?? item?.price ?? 0,
        imageUrl: option.image_url,
      };
    });
  }, [variantsData, item?.price]);

  const cardSummary = useMemo(() => {
    if (!item) {
      return {
        price: 0,
        stockCount: 0,
      };
    }

    const options = variantsData?.options ?? [];
    if (options.length === 0) {
      return {
        price: item.price,
        stockCount: item.stock,
      };
    }

    const validPrices = options
      .map((option) => option.price_override)
      .filter(
        (price): price is number => typeof price === "number" && price > 0,
      );
    const totalStock = options.reduce((sum, option) => sum + option.stock, 0);

    return {
      // Use variant-level pricing/stock when variants exist so cards match service data.
      price: validPrices.length > 0 ? Math.min(...validPrices) : item.price,
      stockCount: totalStock,
    };
  }, [item, variantsData]);

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
  const marketplaceVisibilityLabel =
    item.status !== "ACTIVE"
      ? "Produk diarsipkan"
      : item.showInMarketplace
        ? "Tayang di marketplace"
        : "Draft internal";
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

  const validateVariantImageFile = (file: File): string | null => {
    const maxBytes = 5 * 1024 * 1024;
    const allowed = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
    if (!allowed.has(file.type)) {
      return "Format gambar tidak didukung. Gunakan PNG, JPG, atau WEBP.";
    }
    if (file.size <= 0 || file.size > maxBytes) {
      return "Ukuran gambar maksimal 5 MB.";
    }
    return null;
  };

  const handleUploadVariantImage = async (variant: ProductVariant, file: File) => {
    if (!variant.optionId) return;
    const validationError = validateVariantImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      setUploadingVariantId(variant.optionId);
      await variantActions.uploadOptionImage.mutateAsync({
        productId: id,
        optionId: variant.optionId,
        file,
      });
    } finally {
      setUploadingVariantId(null);
    }
  };

  const handleDeleteVariantImage = async (variant: ProductVariant) => {
    if (!variant.optionId) return;
    try {
      setUploadingVariantId(variant.optionId);
      await variantActions.deleteOptionImage.mutateAsync({
        productId: id,
        optionId: variant.optionId,
      });
    } finally {
      setUploadingVariantId(null);
    }
  };

  const submissionState = submissionQuery.data?.state || "belum_ada_submission";
  const channelStates = channelsQuery.data ?? [];

  return (
    <div className="space-y-6">
      <ProductDetailHeader
        name={item.name}
        sku={item.sku}
        status={status}
        onDelete={() => setDeleteOpen(true)}
        onEdit={() => router.push(`/bumdes/marketplace/inventory/${id}/edit`)}
      />

      <section className="surface-card p-5 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Status Produk Marketplace
            </h3>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <p>
                Status internal:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.status === "ACTIVE" ? "Aktif" : "Diarsipkan"}
                </span>
              </p>
              <p>
                Visibilitas marketplace:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {marketplaceVisibilityLabel}
                </span>
              </p>
              <p>
                Listing ID:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.listingId ? `#${item.listingId}` : "Belum terbentuk"}
                </span>
              </p>
              <p>
                Ownership mode:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.ownershipMode || "Belum diatur"}
                </span>
              </p>
              <p>
                Publishability state:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.publishabilityState || "Belum tersedia"}
                </span>
              </p>
              <p>
                Source stock:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {item.sourceStockType && item.sourceStockReference
                    ? `${item.sourceStockType}:${item.sourceStockReference}`
                    : "Belum tersedia"}
                </span>
              </p>
              <p>
                Kesiapan publikasi:{" "}
                <span className="font-medium text-gray-900 dark:text-white">
                  {publicationReadiness.ready ? "Siap tayang" : "Belum siap"}
                </span>
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant={item.showInMarketplace ? "outline" : "default"}
            onClick={() =>
              actions.update.mutate({
                id: item.id,
                payload: { show_in_marketplace: !item.showInMarketplace },
              })
            }
            disabled={actions.update.isPending || (item.status !== "ACTIVE" && !item.showInMarketplace)}
            className={item.showInMarketplace ? "" : "bg-indigo-600 hover:bg-indigo-700 text-white"}
          >
            {item.showInMarketplace
              ? "Sembunyikan dari Marketplace"
              : "Publikasikan ke Marketplace"}
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!listingId || !item.sellerId || submitForReviewMutation.isPending}
            onClick={() => void submitForReviewMutation.mutateAsync()}
          >
            Ajukan Review
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!listingId || reviewSubmissionMutation.isPending}
            onClick={() => void reviewSubmissionMutation.mutateAsync("approved")}
          >
            Approve
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!listingId || reviewSubmissionMutation.isPending}
            onClick={() => void reviewSubmissionMutation.mutateAsync("held_for_revision")}
          >
            Hold for Revision
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!listingId || reviewSubmissionMutation.isPending}
            onClick={() => void reviewSubmissionMutation.mutateAsync("rejected")}
          >
            Reject
          </Button>
        </div>
        {!publicationReadiness.ready ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-medium">Lengkapi data berikut sebelum produk bisa ditayangkan:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {publicationReadiness.reasons.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="rounded-lg border border-border/60 px-4 py-3 text-sm text-gray-600 dark:text-gray-300 space-y-2">
          <p>
            Submission review:{" "}
            <span className="font-medium text-gray-900 dark:text-white">{submissionState}</span>
          </p>
          {submissionQuery.data?.review_notes ? (
            <p>
              Catatan review:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {submissionQuery.data.review_notes}
              </span>
            </p>
          ) : null}
          {submissionQuery.data?.mapped_inventory_product_id ? (
            <p>
              Inventory product mapping:{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                #{submissionQuery.data.mapped_inventory_product_id}
              </span>
            </p>
          ) : null}
          <div className="space-y-2">
            <p className="font-medium text-gray-900 dark:text-white">Publishability per Channel</p>
            {channelStates.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Belum ada state publishability per channel.
              </p>
            ) : (
              channelStates.map((state: any) => (
                <div
                  key={state.channel}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-border/50 px-3 py-2"
                >
                  <div className="space-y-1">
                    <p>
                      {state.channel}:{" "}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {state.publishability_state}
                      </span>
                    </p>
                    {state.blocker_code ? (
                      <p>
                        Blocker:{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {state.blocker_code}
                        </span>
                      </p>
                    ) : null}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!listingId || updateChannelMutation.isPending}
                      onClick={() =>
                        void updateChannelMutation.mutateAsync({
                          channel: state.channel,
                          state: "published",
                        })
                      }
                    >
                      Publish
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!listingId || updateChannelMutation.isPending}
                      onClick={() =>
                        void updateChannelMutation.mutateAsync({
                          channel: state.channel,
                          state: "blocked",
                          blockerCode: "manual_hold",
                        })
                      }
                    >
                      Block
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

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
            price={cardSummary.price}
            stockCount={cardSummary.stockCount}
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
            onUploadVariantImage={handleUploadVariantImage}
            onDeleteVariantImage={handleDeleteVariantImage}
            uploadingVariantId={uploadingVariantId}
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
