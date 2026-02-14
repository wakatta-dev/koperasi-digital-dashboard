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

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const statusQuery = useQuery({
    queryKey:
      orderId > 0 && trackingToken
        ? QK.marketplace.guestStatus(orderId, trackingToken)
        : ["marketplace", "review", "idle"],
    enabled: Boolean(orderId > 0 && trackingToken),
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

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  if (!orderId || !trackingToken) {
    return (
      <div className="min-h-screen bg-background text-foreground px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4 text-center">
          <h1 className="text-2xl font-bold">Akses Ulasan Tidak Lengkap</h1>
          <p className="text-sm text-muted-foreground">
            Halaman ulasan membutuhkan parameter `order_id` dan `tracking_token`.
          </p>
          <Link
            href="/marketplace/pengiriman"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
          >
            Buka Pelacakan Pesanan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-24">
      <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4 text-center">
        <h1 className="text-2xl font-bold">Ulasan Pesanan</h1>

        {statusQuery.isLoading ? (
          <p className="text-sm text-muted-foreground">Memuat status pesanan...</p>
        ) : null}

        {statusQuery.isError ? (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Gagal memuat status pesanan. Pastikan tautan ulasan masih valid.
            </p>
            <Button type="button" variant="outline" onClick={() => statusQuery.refetch()}>
              Muat Ulang
            </Button>
          </div>
        ) : null}

        {statusQuery.data ? (
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
                : "Buka Form Ulasan"}
            </Button>
          </>
        ) : null}
      </div>

      <ReviewOverlayDialog
        open={open}
        onOpenChange={setOpen}
        items={reviewItems}
        submitting={submitReview.isPending}
        onSubmit={({ items, overallComment }) => {
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
