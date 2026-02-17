/** @format */

import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import {
  getMarketplaceCanonicalStatusLabel,
  normalizeMarketplaceOrderStatus,
} from "@/modules/marketplace/utils/status";
import type {
  MarketplaceGuestOrderStatusDetailResponse,
  MarketplaceOrderStatus,
} from "@/types/api/marketplace";

type TimelineState = "done" | "current" | "upcoming" | "canceled";

type TimelineStep = {
  status: MarketplaceOrderStatus;
  state: TimelineState;
  timestamp?: number;
  reason?: string;
};

type StatusDetailFeatureProps = {
  detail: MarketplaceGuestOrderStatusDetailResponse;
  orderNumber: string;
  loading?: boolean;
  reviewSubmitting?: boolean;
  onRetry: () => void;
  onReset: () => void;
  onOpenReview: () => void;
};

const TIMELINE_STEPS: MarketplaceOrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_VERIFICATION",
  "PROCESSING",
  "IN_DELIVERY",
  "COMPLETED",
];

const TIMELINE_SUPPORTED_STATUSES = new Set<MarketplaceOrderStatus>([
  ...TIMELINE_STEPS,
  "CANCELED",
]);

function getTimelineStateLabel(state: TimelineState) {
  switch (state) {
    case "done":
      return "Selesai";
    case "current":
      return "Sedang Berjalan";
    case "canceled":
      return "Dibatalkan";
    default:
      return "Menunggu";
  }
}

function formatTimelineTimestamp(timestamp?: number) {
  if (!timestamp || timestamp <= 0) {
    return null;
  }
  const date = new Date(timestamp * 1000);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function buildTimeline(detail: MarketplaceGuestOrderStatusDetailResponse): TimelineStep[] {
  const history = (detail.status_history ?? [])
    .map((entry, index) => {
      const status = normalizeMarketplaceOrderStatus(entry.status);
      if (!TIMELINE_SUPPORTED_STATUSES.has(status)) {
        return null;
      }
      return {
        status,
        timestamp: typeof entry.timestamp === "number" ? entry.timestamp : undefined,
        reason: entry.reason?.trim() || undefined,
        index,
      };
    })
    .filter((entry): entry is NonNullable<typeof entry> => entry !== null)
    .sort((a, b) => {
      const ta = typeof a.timestamp === "number" ? a.timestamp : Number.MAX_SAFE_INTEGER;
      const tb = typeof b.timestamp === "number" ? b.timestamp : Number.MAX_SAFE_INTEGER;
      if (ta === tb) {
        return a.index - b.index;
      }
      return ta - tb;
    });

  const firstReached = new Map<
    MarketplaceOrderStatus,
    { timestamp?: number; reason?: string }
  >();
  let canceledMeta: { timestamp?: number; reason?: string } | null = null;
  let maxReachedIndex = -1;

  for (const entry of history) {
    if (!firstReached.has(entry.status)) {
      firstReached.set(entry.status, {
        timestamp: entry.timestamp,
        reason: entry.reason,
      });
    }
    if (entry.status === "CANCELED") {
      canceledMeta = {
        timestamp: entry.timestamp,
        reason: entry.reason,
      };
      continue;
    }
    const idx = TIMELINE_STEPS.indexOf(entry.status);
    if (idx > maxReachedIndex) {
      maxReachedIndex = idx;
    }
  }

  const currentStatus = normalizeMarketplaceOrderStatus(detail.status);
  if (currentStatus === "CANCELED") {
    const canceledTimeline: TimelineStep[] = TIMELINE_STEPS.map((step, index) => {
      const reachedMeta = firstReached.get(step);
      return {
        status: step,
        state: index <= Math.max(maxReachedIndex, 0) ? "done" : "upcoming",
        timestamp: reachedMeta?.timestamp,
        reason: reachedMeta?.reason,
      };
    });

    canceledTimeline.push({
      status: "CANCELED",
      state: "canceled",
      timestamp: canceledMeta?.timestamp,
      reason: canceledMeta?.reason,
    });
    return canceledTimeline;
  }

  const currentIndex = TIMELINE_STEPS.indexOf(currentStatus);
  const activeIndex = Math.max(currentIndex, maxReachedIndex, 0);
  return TIMELINE_STEPS.map((step, index) => {
    const reachedMeta = firstReached.get(step);
    const state: TimelineState =
      index < activeIndex ? "done" : index === activeIndex ? "current" : "upcoming";
    return {
      status: step,
      state,
      timestamp: reachedMeta?.timestamp,
      reason: reachedMeta?.reason,
    };
  });
}

export function StatusDetailFeature({
  detail,
  orderNumber,
  loading = false,
  reviewSubmitting = false,
  onRetry,
  onReset,
  onOpenReview,
}: StatusDetailFeatureProps) {
  const timeline = useMemo(() => buildTimeline(detail), [detail]);

  const reviewButton = (() => {
    if (detail.review_state === "submitted") {
      return (
        <Button
          data-testid="marketplace-tracking-review-submitted-button"
          type="button"
          disabled
          className="bg-muted text-muted-foreground"
        >
          Ulasan Sudah Dikirim
        </Button>
      );
    }
    if (detail.review_state === "eligible") {
      return (
        <Button
          data-testid="marketplace-tracking-open-review-button"
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
          onClick={onOpenReview}
          disabled={reviewSubmitting}
        >
          {reviewSubmitting ? "Mengirim ulasan..." : "Konfirmasi Pesanan Diterima"}
        </Button>
      );
    }
    return (
      <Button
        data-testid="marketplace-tracking-review-disabled-button"
        type="button"
        disabled
        className="bg-muted text-muted-foreground"
      >
        Belum Bisa Direview
      </Button>
    );
  })();

  return (
    <section
      className="mx-auto w-full max-w-6xl space-y-6"
      data-testid="marketplace-tracking-status-detail"
    >
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold text-foreground">Status Pesanan</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
            #{orderNumber}
          </span>
        </div>

        <ol className="space-y-4 md:space-y-5" aria-label="Timeline status pesanan">
          {timeline.map((step, index) => (
            <li
              key={step.status}
              className="flex items-start gap-3"
              data-testid={`marketplace-tracking-timeline-step-${step.status.toLowerCase()}`}
            >
              <div className="relative flex w-7 flex-col items-center pt-0.5">
                <span
                  className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    step.state === "done"
                      ? "border-indigo-600 bg-indigo-600 text-white"
                      : step.state === "current"
                        ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                        : step.state === "canceled"
                          ? "border-rose-300 bg-rose-100 text-rose-700"
                          : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {step.state === "done"
                    ? "✓"
                    : step.state === "current"
                      ? "●"
                      : step.state === "canceled"
                        ? "✕"
                        : "•"}
                </span>
                {index < timeline.length - 1 ? (
                  <span
                    className={`mt-1 h-9 w-px ${
                      step.state === "done" || step.state === "current"
                        ? "bg-indigo-300"
                        : "bg-border"
                    }`}
                  />
                ) : null}
              </div>

              <div className="min-w-0 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-sm ${
                      step.state === "done" || step.state === "current"
                        ? "font-semibold text-foreground"
                        : step.state === "canceled"
                          ? "font-semibold text-rose-700 dark:text-rose-400"
                          : "text-muted-foreground"
                    }`}
                  >
                    {getMarketplaceCanonicalStatusLabel(step.status)}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      step.state === "done"
                        ? "bg-indigo-50 text-indigo-700"
                        : step.state === "current"
                          ? "bg-indigo-100 text-indigo-700"
                          : step.state === "canceled"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {getTimelineStateLabel(step.state)}
                  </span>
                </div>
                {step.timestamp ? (
                  <p className="text-xs text-muted-foreground">
                    {formatTimelineTimestamp(step.timestamp)}
                  </p>
                ) : null}
                {step.reason ? (
                  <p
                    className={`text-xs ${
                      step.state === "canceled"
                        ? "text-rose-700 dark:text-rose-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.reason}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-foreground">Detail Pengiriman</h3>
          <div className="space-y-2 text-sm">
            <p className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium text-foreground">
                {getMarketplaceCanonicalStatusLabel(detail.status)}
              </span>
            </p>
            <p className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Kurir</span>
              <span className="font-medium text-foreground">
                {detail.shipping_method || "-"}
              </span>
            </p>
            <p className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Nomor Resi</span>
              <span className="font-medium text-foreground">
                {detail.shipping_tracking_number || "Belum tersedia"}
              </span>
            </p>
            <p className="flex items-start justify-between gap-3">
              <span className="text-muted-foreground">Metode Pembayaran</span>
              <span className="font-medium text-foreground">
                {detail.payment_method || "-"}
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-foreground">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {detail.items.map((item) => (
              <div
                key={`${item.order_item_id ?? item.product_id}`}
                className="flex items-center justify-between gap-3"
                data-testid={`marketplace-tracking-summary-item-${item.order_item_id ?? item.product_id}`}
              >
                <span className="text-foreground">
                  {item.product_name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="border-t border-border pt-2 font-semibold text-foreground">
              Total: {formatCurrency(detail.total)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          data-testid="marketplace-tracking-retry-status-button"
          type="button"
          variant="outline"
          className="border-border"
          onClick={onRetry}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat Ulang Status"}
        </Button>
        <Button
          data-testid="marketplace-tracking-reset-form-button"
          type="button"
          variant="outline"
          className="border-border"
          onClick={onReset}
          disabled={loading}
        >
          Lacak Pesanan Lain
        </Button>
        {reviewButton}
      </div>
    </section>
  );
}
