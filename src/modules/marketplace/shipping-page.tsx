/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "../landing/components/navbar";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";
import { StatusDetailFeature } from "./components/shipping/status-detail-feature";
import { TrackingFormFeature } from "./components/shipping/tracking-form-feature";
import { QK } from "@/hooks/queries/queryKeys";
import { ensureSuccess } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  getMarketplaceGuestOrderStatus,
  submitMarketplaceOrderReview,
  trackMarketplaceOrder,
} from "@/services/api";
import type { MarketplaceGuestTrackResponse } from "@/types/api/marketplace";

type TrackingView = "track" | "not-found" | "status";

export function MarketplaceShippingPage() {
  const { data: cart } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;

  const [view, setView] = useState<TrackingView>("track");
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    orderNumber?: string;
    contact?: string;
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewError, setReviewError] = useState<string | undefined>();
  const [trackResult, setTrackResult] = useState<
    MarketplaceGuestTrackResponse | null
  >(null);

  const trackingLookup = useMutation({
    mutationFn: async (payload: { order_number: string; contact: string }) =>
      ensureSuccess(await trackMarketplaceOrder(payload)),
    onSuccess: (payload) => {
      setTrackResult(payload);
      setErrorMessage(undefined);
      setFieldErrors({});
      setView("status");
    },
    onError: (err: any) => {
      const message = (err as Error)?.message?.toLowerCase() ?? "";
      if (message.includes("not found")) {
        setView("not-found");
        setErrorMessage(
          "Pesanan tidak ditemukan. Periksa kode pesanan dan email/nomor HP yang digunakan saat checkout."
        );
        return;
      }

      setView("track");
      setErrorMessage("Terjadi gangguan saat melacak pesanan. Silakan coba lagi.");
    },
  });

  const orderId = trackResult?.order_id;
  const trackingToken = trackResult?.tracking_token;

  const statusQuery = useQuery({
    queryKey:
      orderId && trackingToken
        ? QK.marketplace.guestStatus(orderId, trackingToken)
        : ["marketplace", "orders", "guest-status", "idle"],
    enabled: Boolean(orderId && trackingToken),
    queryFn: async () =>
      ensureSuccess(await getMarketplaceGuestOrderStatus(orderId as number, trackingToken as string)),
  });

  useEffect(() => {
    if (!statusQuery.isError || !trackResult) {
      return;
    }

    const message =
      ((statusQuery.error as Error | undefined)?.message ?? "").toLowerCase();

    if (message.includes("invalid tracking token") || message.includes("forbidden")) {
      setErrorMessage(
        "Tautan pelacakan tidak valid atau sudah kedaluwarsa. Silakan lacak ulang pesanan Anda."
      );
      setView("track");
      setTrackResult(null);
      return;
    }

    setErrorMessage("Gagal memuat status pesanan. Silakan coba lagi.");
  }, [statusQuery.error, statusQuery.isError, trackResult]);

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
      setReviewError(undefined);
      setReviewOpen(false);
      showToastSuccess("Ulasan terkirim", "Terima kasih atas ulasan Anda.");
      await statusQuery.refetch();
    },
    onError: (err: any) => {
      const message =
        (err as Error)?.message ||
        "Gagal mengirim ulasan. Periksa kembali data ulasan Anda.";
      setReviewError(message);
      showToastError("Gagal mengirim ulasan", message);
    },
  });

  const statusDetail = statusQuery.data;
  const reviewItems = useMemo(() => {
    if (!statusDetail) {
      return [];
    }

    return statusDetail.items
      .filter((item) => (item.order_item_id ?? 0) > 0)
      .map((item) => ({
        id: String(item.order_item_id),
        orderItemId: item.order_item_id,
        name: item.product_name,
      }));
  }, [statusDetail]);

  const resetTracking = () => {
    setView("track");
    setOrderNumber("");
    setContact("");
    setErrorMessage(undefined);
    setFieldErrors({});
    setTrackResult(null);
    setReviewOpen(false);
    setReviewError(undefined);
  };

  const handleTrack = () => {
    const nextErrors: { orderNumber?: string; contact?: string } = {};
    if (!orderNumber.trim()) {
      nextErrors.orderNumber = "Kode pesanan wajib diisi.";
    }
    if (!contact.trim()) {
      nextErrors.contact = "Email atau nomor HP wajib diisi.";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setErrorMessage("Lengkapi data pelacakan terlebih dahulu.");
      setView("track");
      return;
    }

    setErrorMessage(undefined);
    trackingLookup.mutate({
      order_number: orderNumber.trim(),
      contact: contact.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar activeLabel="Marketplace" showCart cartCount={cartCount} />

      <main className="min-h-screen px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {view === "track" ? (
          <TrackingFormFeature
            title="Lacak Pesanan Anda"
            description="Masukkan kode pesanan dan email/nomor HP untuk melihat status terkini tanpa login."
            orderNumber={orderNumber}
            contact={contact}
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            submitting={trackingLookup.isPending}
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
          />
        ) : null}

        {view === "not-found" ? (
          <TrackingFormFeature
            title="Pesanan Tidak Ditemukan"
            description="Kami tidak menemukan data dengan kombinasi yang Anda masukkan."
            orderNumber={orderNumber}
            contact={contact}
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            submitting={trackingLookup.isPending}
            notFound
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
            onReset={resetTracking}
          />
        ) : null}

        {view === "status" && trackResult && statusDetail ? (
          <StatusDetailFeature
            detail={statusDetail}
            orderNumber={trackResult.order_number}
            loading={statusQuery.isFetching}
            reviewSubmitting={submitReview.isPending}
            onRetry={() => {
              void statusQuery.refetch();
            }}
            onReset={resetTracking}
            onOpenReview={() => {
              if (statusDetail.review_state !== "eligible") {
                showToastError(
                  "Ulasan belum tersedia",
                  "Pesanan harus berstatus selesai sebelum dapat direview."
                );
                return;
              }
              setReviewError(undefined);
              setReviewOpen(true);
            }}
          />
        ) : null}
      </main>

      <ReviewOverlayDialog
        open={reviewOpen}
        onOpenChange={setReviewOpen}
        items={reviewItems}
        submitting={submitReview.isPending}
        submitError={reviewError}
        onSubmit={({ items, overallComment }) => {
          if (!trackResult?.tracking_token || !trackResult?.order_id) {
            setReviewError("Token pelacakan tidak tersedia. Lacak ulang pesanan Anda.");
            return;
          }
          if (!items.length) {
            setReviewError("Pesanan ini belum memiliki item yang dapat direview.");
            return;
          }

          submitReview.mutate({
            orderId: trackResult.order_id,
            body: {
              tracking_token: trackResult.tracking_token,
              overall_comment: overallComment,
              items,
            },
          });
        }}
      />

      <LandingFooter />
    </div>
  );
}
