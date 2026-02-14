/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { ensureSuccess } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";
import {
  getMarketplaceGuestOrderStatus,
  submitMarketplaceOrderReview,
} from "@/services/api";

export function MarketplaceReviewPage() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order_id") ?? "");
  const trackingToken = searchParams.get("tracking_token") ?? "";
  const hasTrackingParams = Boolean(orderId > 0 && trackingToken);

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const statusQuery = useQuery({
    queryKey:
      hasTrackingParams
        ? QK.marketplace.guestStatus(orderId, trackingToken)
        : ["marketplace", "review", "idle"],
    enabled: hasTrackingParams,
    queryFn: async () =>
      ensureSuccess(await getMarketplaceGuestOrderStatus(orderId, trackingToken)),
  });

  const submitReview = useMutation({
    mutationFn: async (payload: {
      orderId: number;
      body: {
        tracking_token: string;
        overall_comment?: string;
        items: Array<{ order_item_id: number; rating: number; comment?: string }>;
      };
    }) => ensureSuccess(await submitMarketplaceOrderReview(payload.orderId, payload.body)),
    onSuccess: async () => {
      showToastSuccess("Ulasan terkirim", "Terima kasih atas ulasan Anda.");
      setOpen(false);
      await statusQuery.refetch();
    },
    onError: (err: any) => {
      showToastError("Gagal mengirim ulasan", err);
    },
  });

  const reviewItems = useMemo(() => {
    const detail = statusQuery.data;
    if (!detail) {
      return [];
    }
    return detail.items
      .filter((item) => (item.order_item_id ?? 0) > 0)
      .map((item) => ({
        id: String(item.order_item_id),
        orderItemId: item.order_item_id,
        name: item.product_name,
      }));
  }, [statusQuery.data]);

  const canOpenReview =
    statusQuery.data?.review_state === "eligible" && reviewItems.length > 0;
  const quickReviewItems = useMemo(
    () => [{ id: "1", orderItemId: 1, name: "Produk Pesanan Marketplace" }],
    []
  );
  const activeReviewItems = hasTrackingParams ? reviewItems : quickReviewItems;

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Ulasan Pesanan</h1>

        {!hasTrackingParams ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Buka konfirmasi pesanan untuk mengisi ulasan. Untuk sinkronisasi otomatis,
              akses ulasan dari halaman pelacakan pesanan.
            </p>
            <Link
              href="/marketplace/pengiriman"
              className="inline-flex items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Buka Pelacakan Pesanan
            </Link>
          </div>
        ) : null}

        {hasTrackingParams && statusQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat status pesanan...</p>
        ) : null}

        {hasTrackingParams && statusQuery.isError ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Gagal memuat status pesanan. Pastikan tautan ulasan masih valid.
            </p>
            <Button type="button" variant="outline" onClick={() => statusQuery.refetch()}>
              Muat Ulang
            </Button>
          </div>
        ) : null}

        {hasTrackingParams && statusQuery.data ? (
          <>
            <p className="text-sm text-muted-foreground">
              Status review saat ini: <strong>{statusQuery.data.review_state}</strong>
            </p>
            <Button
              ref={triggerRef}
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
              onClick={() => {
                if (!canOpenReview) {
                  showToastError(
                    "Ulasan belum dapat dikirim",
                    "Pesanan belum eligible atau sudah pernah direview."
                  );
                  return;
                }
                setOpen(true);
              }}
              disabled={statusQuery.data.review_state === "submitted"}
            >
              {statusQuery.data.review_state === "submitted"
                ? "Ulasan Sudah Dikirim"
                : "Buka Konfirmasi Pesanan"}
            </Button>
          </>
        ) : null}

        {!hasTrackingParams ? (
          <Button
            ref={triggerRef}
            type="button"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            onClick={() => setOpen(true)}
          >
            Buka Konfirmasi Pesanan
          </Button>
        ) : null}
      </div>

      <ReviewOverlayDialog
        open={open}
        onOpenChange={setOpen}
        items={activeReviewItems}
        submitting={submitReview.isPending}
        onSubmit={({ items, overallComment }) => {
          if (!hasTrackingParams) {
            showToastSuccess(
              "Konfirmasi diterima",
              "Silakan buka pelacakan pesanan untuk mengirim ulasan ke sistem."
            );
            setOpen(false);
            return;
          }

          submitReview.mutate({
            orderId,
            body: {
              tracking_token: trackingToken,
              overall_comment: overallComment,
              items,
            },
          });
        }}
      />
    </div>
  );
}
