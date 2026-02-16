/** @format */

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";
import {
  classifyMarketplaceApiError,
  ensureMarketplaceSuccess,
  getMarketplaceGuestOrderStatus,
  submitMarketplaceOrderReview,
  withMarketplaceDenyReasonMessage,
} from "@/services/api";

export function MarketplaceReviewPage() {
  const searchParams = useSearchParams();
  const orderId = Number(searchParams.get("order_id") ?? "");
  const trackingToken = searchParams.get("tracking_token") ?? "";
  const hasTrackingParams = Boolean(orderId > 0 && trackingToken);
  const allowDevelopmentQuickReview = process.env.NODE_ENV !== "production";

  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const statusQuery = useQuery({
    queryKey:
      hasTrackingParams
        ? QK.marketplace.guestStatus(orderId, trackingToken)
        : ["marketplace", "review", "idle"],
    enabled: hasTrackingParams,
    queryFn: async () =>
      ensureMarketplaceSuccess(
        await getMarketplaceGuestOrderStatus(orderId, trackingToken)
      ),
  });

  const statusQueryErrorMessage = useMemo(() => {
    if (!statusQuery.isError) {
      return null;
    }
    const classified = classifyMarketplaceApiError(statusQuery.error);
    if (classified.kind === "deny") {
      return withMarketplaceDenyReasonMessage({
        fallbackMessage:
          "Akses ulasan ditolak. Pastikan tautan berasal dari pelacakan pesanan yang valid.",
        code: classified.code,
      });
    }
    if (classified.kind === "not_found") {
      return "Pesanan tidak ditemukan. Periksa ulang tautan ulasan Anda dari halaman pelacakan.";
    }
    if (classified.kind === "conflict") {
      return "Ulasan belum dapat dibuka karena status pesanan belum memenuhi syarat.";
    }
    if (classified.kind === "service_unavailable") {
      return "Layanan ulasan sedang tidak tersedia. Coba lagi beberapa menit lagi.";
    }
    return "Gagal memuat status pesanan. Pastikan tautan ulasan masih valid.";
  }, [statusQuery.error, statusQuery.isError]);

  const submitReview = useMutation({
    mutationFn: async (payload: {
      orderId: number;
      body: {
        tracking_token: string;
        overall_comment?: string;
        items: Array<{ order_item_id: number; rating: number; comment?: string }>;
      };
    }) =>
      ensureMarketplaceSuccess(
        await submitMarketplaceOrderReview(payload.orderId, payload.body)
      ),
    onSuccess: async () => {
      showToastSuccess("Ulasan terkirim", "Terima kasih atas ulasan Anda.");
      setOpen(false);
      await statusQuery.refetch();
    },
    onError: (err: any) => {
      const classified = classifyMarketplaceApiError(err);
      const message = (() => {
        if (classified.kind === "deny") {
          return withMarketplaceDenyReasonMessage({
            fallbackMessage:
              "Akses ulasan ditolak. Pastikan token pelacakan masih valid.",
            code: classified.code,
          });
        }
        if (classified.kind === "not_found") {
          return "Pesanan tidak ditemukan. Buka ulang dari halaman pelacakan.";
        }
        if (classified.kind === "conflict") {
          return "Ulasan tidak dapat dikirim karena status pesanan belum eligible atau sudah pernah direview.";
        }
        if (classified.kind === "service_unavailable") {
          return "Layanan ulasan sedang terganggu. Silakan coba kembali beberapa saat lagi.";
        }
        return classified.message || "Gagal mengirim ulasan.";
      })();
      showToastError("Gagal mengirim ulasan", message);
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
    () =>
      allowDevelopmentQuickReview
        ? [{ id: "1", orderItemId: 1, name: "Produk Pesanan Marketplace" }]
        : [],
    [allowDevelopmentQuickReview]
  );
  const activeReviewItems = hasTrackingParams ? reviewItems : quickReviewItems;

  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <div
      className="min-h-screen bg-background text-foreground px-6 py-24"
      data-testid="marketplace-review-page-root"
    >
      <div
        className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-sm space-y-4 text-center"
        data-testid="marketplace-review-page-main"
      >
        <h1 className="text-2xl font-bold">Ulasan Pesanan</h1>

        {!hasTrackingParams ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Buka konfirmasi pesanan untuk mengisi ulasan. Untuk sinkronisasi otomatis,
              akses ulasan dari halaman pelacakan pesanan.
            </p>
            {!allowDevelopmentQuickReview ? (
              <p className="text-sm text-amber-700">
                Mode pengisian ulasan tanpa token hanya tersedia di development.
                Di production, ulasan wajib melalui data backend dari pelacakan.
              </p>
            ) : null}
            <Link
              data-testid="marketplace-review-open-tracking-link"
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
              {statusQueryErrorMessage}
            </p>
            <Button
              data-testid="marketplace-review-reload-status-button"
              type="button"
              variant="outline"
              onClick={() => statusQuery.refetch()}
            >
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
              data-testid="marketplace-review-open-dialog-button"
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
            data-testid="marketplace-review-open-dialog-dev-button"
            ref={triggerRef}
            type="button"
            className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white hover:bg-indigo-700"
            disabled={!allowDevelopmentQuickReview}
            onClick={() => setOpen(true)}
          >
            {allowDevelopmentQuickReview
              ? "Buka Konfirmasi Pesanan"
              : "Gunakan Pelacakan Pesanan"}
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
            if (!allowDevelopmentQuickReview) {
              showToastError(
                "Ulasan membutuhkan data backend",
                "Silakan buka ulasan dari halaman pelacakan pesanan."
              );
              setOpen(false);
              return;
            }
            showToastSuccess(
              "Simulasi konfirmasi tersimpan",
              "Mode ini hanya untuk development. Kirim ulasan production melalui pelacakan pesanan."
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
