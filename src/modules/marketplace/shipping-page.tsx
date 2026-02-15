/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";

import { LandingFooter } from "../landing/components/footer";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { useMarketplaceCart } from "./hooks/useMarketplaceProducts";
import { ReviewOverlayDialog } from "./components/review/review-overlay-dialog";
import { StatusDetailFeature } from "./components/shipping/status-detail-feature";
import { TrackingFormFeature } from "./components/shipping/tracking-form-feature";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  classifyMarketplaceApiError,
  ensureMarketplaceSuccess,
  getMarketplaceGuestOrderStatus,
  submitMarketplaceOrderReview,
  trackMarketplaceOrder,
} from "@/services/api";
import {
  readBuyerOrderContext,
  type BuyerOrderContext,
} from "./state/buyer-checkout-context";
import type {
  MarketplaceGuestOrderStatusDetailResponse,
  MarketplaceGuestTrackResponse,
} from "@/types/api/marketplace";

type TrackingView =
  | "track"
  | "not-found"
  | "deny"
  | "service-unavailable"
  | "status";
type LocalTrackingPreview = {
  orderNumber: string;
  source: "context" | "development-preset";
  detail: MarketplaceGuestOrderStatusDetailResponse;
};

const TRACKING_RECOVERY_PRESET = {
  orderNumber: "INV-20231024-0001",
  contact: "budi@email.com",
} as const;

function parseOrderIdFromOrderNumber(orderNumber: string): number | null {
  const normalized = orderNumber.trim().toUpperCase();
  const match = normalized.match(/^ORD-(\d+)$/);
  if (!match) {
    return null;
  }
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildLocalPreviewFromContext(
  orderNumber: string,
  context: BuyerOrderContext
): LocalTrackingPreview {
  const now = Math.floor(Date.now() / 1000);
  return {
    orderNumber,
    source: "context",
    detail: {
      id: context.order.id,
      order_number: orderNumber,
      status: "PAYMENT_VERIFICATION",
      total: context.order.total,
      payment_method: context.checkout.paymentMethod,
      shipping_method: context.checkout.shippingOption,
      shipping_tracking_number: "",
      items: context.order.items,
      status_history: [
        { status: "PENDING_PAYMENT", timestamp: context.order.created_at ?? now },
        { status: "PAYMENT_VERIFICATION", timestamp: now },
      ],
      review_state: "not_eligible",
    },
  };
}

function buildTrackingRecoveryPresetPreview(
  orderNumber: string
): LocalTrackingPreview {
  const now = Math.floor(Date.now() / 1000);
  return {
    orderNumber,
    source: "development-preset",
    detail: {
      id: 202310240001,
      order_number: orderNumber,
      status: "PAYMENT_VERIFICATION",
      total: 3500,
      payment_method: "TRANSFER_BANK",
      shipping_method: "JNE",
      shipping_tracking_number: "JNE-LOCAL-PRESET",
      items: [
        {
          order_item_id: 1,
          product_id: 1,
          product_name: "Mi Instan",
          product_sku: "MI-001",
          quantity: 1,
          price: 3500,
          subtotal: 3500,
        },
      ],
      status_history: [
        { status: "PENDING_PAYMENT", timestamp: now - 3600 },
        { status: "PAYMENT_VERIFICATION", timestamp: now - 1200 },
      ],
      review_state: "not_eligible",
    },
  };
}

function resolveLocalTrackingPreview(
  orderNumber: string,
  contact: string,
  options?: { allowDevelopmentPreset?: boolean }
): LocalTrackingPreview | null {
  const normalizedOrderNumber = orderNumber.trim();
  const normalizedContact = contact.trim().toLowerCase();
  const orderId = parseOrderIdFromOrderNumber(normalizedOrderNumber);

  if (orderId) {
    const contextResult = readBuyerOrderContext(orderId);
    if (contextResult.context) {
      const candidateContacts = [
        contextResult.context.checkout.customerEmail,
        contextResult.context.checkout.customerPhone,
      ]
        .map((value) => value.trim().toLowerCase())
        .filter(Boolean);
      if (candidateContacts.includes(normalizedContact)) {
        return buildLocalPreviewFromContext(normalizedOrderNumber, contextResult.context);
      }
    }
  }

  if (!options?.allowDevelopmentPreset) {
    return null;
  }

  if (
    normalizedOrderNumber.toUpperCase() === TRACKING_RECOVERY_PRESET.orderNumber &&
    normalizedContact === TRACKING_RECOVERY_PRESET.contact
  ) {
    return buildTrackingRecoveryPresetPreview(normalizedOrderNumber);
  }

  return null;
}

export function MarketplaceShippingPage() {
  const { data: cart } = useMarketplaceCart();
  const cartCount = cart?.item_count ?? 0;
  const allowDevelopmentPreset = process.env.NODE_ENV !== "production";

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
  const [localPreview, setLocalPreview] = useState<LocalTrackingPreview | null>(
    null
  );

  const trackingLookup = useMutation({
    mutationFn: async (payload: { order_number: string; contact: string }) =>
      ensureMarketplaceSuccess(await trackMarketplaceOrder(payload)),
    onSuccess: (payload) => {
      setTrackResult(payload);
      setLocalPreview(null);
      setErrorMessage(undefined);
      setFieldErrors({});
      setView("status");
    },
    onError: (err: any, payload) => {
      const classified = classifyMarketplaceApiError(err);
      if (classified.kind === "not_found") {
        const localResolved = resolveLocalTrackingPreview(
          payload.order_number,
          payload.contact,
          { allowDevelopmentPreset }
        );
        if (localResolved) {
          setTrackResult(null);
          setLocalPreview(localResolved);
          setErrorMessage(undefined);
          setFieldErrors({});
          setView("status");
          return;
        }

        setView("not-found");
        setLocalPreview(null);
        setErrorMessage(
          "Kami tidak dapat menemukan pesanan. Periksa kode pesanan dan email/nomor HP yang digunakan saat checkout."
        );
        return;
      }

      if (classified.kind === "deny") {
        setView("deny");
        setLocalPreview(null);
        setErrorMessage(
          "Akses pelacakan ditolak oleh kebijakan marketplace. Pastikan data pelacakan valid dan berasal dari tenant yang benar."
        );
        return;
      }

      if (classified.kind === "service_unavailable") {
        setView("service-unavailable");
        setLocalPreview(null);
        setErrorMessage(
          "Layanan pelacakan sedang tidak tersedia. Coba lagi beberapa menit lagi."
        );
        return;
      }

      setView("track");
      setLocalPreview(null);
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
      ensureMarketplaceSuccess(
        await getMarketplaceGuestOrderStatus(orderId as number, trackingToken as string)
      ),
  });

  useEffect(() => {
    if (!statusQuery.isError || !trackResult) {
      return;
    }

    const classified = classifyMarketplaceApiError(statusQuery.error);

    if (classified.kind === "deny") {
      setErrorMessage(
        "Tautan pelacakan tidak valid atau sudah kedaluwarsa. Silakan lacak ulang pesanan Anda."
      );
      setView("track");
      setTrackResult(null);
      return;
    }

    if (classified.kind === "not_found") {
      setErrorMessage(
        "Pesanan tidak ditemukan. Silakan periksa ulang kode pesanan dan data kontak Anda."
      );
      setView("not-found");
      setTrackResult(null);
      return;
    }

    if (classified.kind === "service_unavailable") {
      setErrorMessage(
        "Layanan pelacakan sedang tidak tersedia. Silakan coba kembali beberapa menit lagi."
      );
      setView("service-unavailable");
      return;
    }

    setErrorMessage("Gagal memuat status pesanan. Silakan coba lagi.");
    setView("track");
  }, [statusQuery.error, statusQuery.isError, trackResult]);

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
      setReviewError(undefined);
      setReviewOpen(false);
      showToastSuccess("Ulasan terkirim", "Terima kasih atas ulasan Anda.");
      await statusQuery.refetch();
    },
    onError: (err: any) => {
      const classified = classifyMarketplaceApiError(err);
      const message = (() => {
        if (classified.kind === "deny") {
          return "Akses ulasan ditolak. Pastikan token pelacakan dan status pesanan masih valid.";
        }
        if (classified.kind === "conflict") {
          return "Ulasan tidak dapat dikirim karena status pesanan belum memenuhi syarat atau sudah pernah direview.";
        }
        if (classified.kind === "service_unavailable") {
          return "Layanan ulasan sedang terganggu. Silakan coba lagi beberapa saat lagi.";
        }
        return (
          classified.message ||
          "Gagal mengirim ulasan. Periksa kembali data ulasan Anda."
        );
      })();
      setReviewError(message);
      showToastError("Gagal mengirim ulasan", message);
    },
  });

  const statusDetail = localPreview?.detail ?? statusQuery.data;
  const statusOrderNumber = localPreview?.orderNumber ?? trackResult?.order_number;
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
    setLocalPreview(null);
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
    setLocalPreview(null);
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

        {view === "deny" ? (
          <TrackingFormFeature
            title="Akses Pelacakan Ditolak"
            description="Sistem menolak akses pelacakan untuk kombinasi data yang Anda kirim."
            orderNumber={orderNumber}
            contact={contact}
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            submitting={trackingLookup.isPending}
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
            onReset={resetTracking}
          />
        ) : null}

        {view === "service-unavailable" ? (
          <TrackingFormFeature
            title="Pelacakan Sedang Tidak Tersedia"
            description="Terjadi gangguan sementara pada layanan pelacakan marketplace."
            orderNumber={orderNumber}
            contact={contact}
            fieldErrors={fieldErrors}
            errorMessage={errorMessage}
            submitting={trackingLookup.isPending}
            onOrderNumberChange={setOrderNumber}
            onContactChange={setContact}
            onSubmit={handleTrack}
            onReset={resetTracking}
          />
        ) : null}

        {view === "status" && statusDetail ? (
          <div className="space-y-4">
            {localPreview ? (
              <div className="mx-auto w-full max-w-5xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {localPreview.source === "context"
                  ? "Data pelacakan ini berasal dari context lokal sementara di perangkat Anda. Status backend belum terkonfirmasi."
                  : "Anda sedang menggunakan preset pelacakan simulasi (development-only). Data ini tidak berasal dari backend produksi."}
              </div>
            ) : null}
            <StatusDetailFeature
              detail={statusDetail}
              orderNumber={statusOrderNumber ?? "-"}
              loading={statusQuery.isFetching}
              reviewSubmitting={submitReview.isPending}
              onRetry={() => {
                if (trackResult) {
                  void statusQuery.refetch();
                }
              }}
              onReset={resetTracking}
              onOpenReview={() => {
                if (localPreview) {
                  showToastError(
                    "Ulasan tidak dapat dikirim dari data lokal",
                    "Lacak ulang hingga data backend tersedia sebelum mengirim ulasan."
                  );
                  return;
                }
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
          </div>
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
