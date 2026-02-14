/** @format */

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/format";
import { getMarketplaceCanonicalStatusLabel } from "@/modules/marketplace/utils/status";
import type {
  MarketplaceGuestOrderStatusDetailResponse,
  MarketplaceOrderStatus,
} from "@/types/api/marketplace";

type TimelineStep = {
  status: MarketplaceOrderStatus;
  done: boolean;
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

function buildTimeline(detail: MarketplaceGuestOrderStatusDetailResponse): TimelineStep[] {
  const history = detail.status_history ?? [];
  if (history.length > 0) {
    const normalized = history
      .map((entry) => ({
        status: entry.status as MarketplaceOrderStatus,
        timestamp: entry.timestamp,
        reason: entry.reason,
      }))
      .filter((entry) => TIMELINE_STEPS.includes(entry.status));

    const seen = new Set<MarketplaceOrderStatus>();
    const deduped = normalized.filter((entry) => {
      if (seen.has(entry.status)) {
        return false;
      }
      seen.add(entry.status);
      return true;
    });

    return TIMELINE_STEPS.map((step) => {
      const matched = deduped.find((entry) => entry.status === step);
      return {
        status: step,
        done: Boolean(matched),
        timestamp: matched?.timestamp,
        reason: matched?.reason,
      };
    });
  }

  const activeIndex = TIMELINE_STEPS.indexOf(detail.status as MarketplaceOrderStatus);
  return TIMELINE_STEPS.map((step, index) => ({
    status: step,
    done: index <= Math.max(activeIndex, 0),
  }));
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
  const timeline = buildTimeline(detail);

  const reviewButton = (() => {
    if (detail.review_state === "submitted") {
      return (
        <Button type="button" disabled className="bg-muted text-muted-foreground">
          Ulasan Sudah Dikirim
        </Button>
      );
    }
    if (detail.review_state === "eligible") {
      return (
        <Button
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
      <Button type="button" disabled className="bg-muted text-muted-foreground">
        Belum Bisa Direview
      </Button>
    );
  })();

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">Status Pesanan</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
            #{orderNumber}
          </span>
        </div>

        <ol className="space-y-3" aria-label="Timeline status pesanan">
          {timeline.map((step) => (
            <li key={step.status} className="flex items-start gap-3">
              <span
                className={`inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.done
                    ? "bg-indigo-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.done ? "✓" : "•"}
              </span>
              <div className="space-y-1">
                <span
                  className={`text-sm ${
                    step.done
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {getMarketplaceCanonicalStatusLabel(step.status)}
                </span>
                {step.timestamp ? (
                  <p className="text-xs text-muted-foreground">
                    {new Date(step.timestamp * 1000).toLocaleString("id-ID")}
                  </p>
                ) : null}
                {step.reason ? (
                  <p className="text-xs text-muted-foreground">{step.reason}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-foreground">Detail Pengiriman</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Status:</span>{" "}
              {getMarketplaceCanonicalStatusLabel(detail.status)}
            </p>
            <p>
              <span className="font-medium text-foreground">Kurir:</span>{" "}
              {detail.shipping_method || "-"}
            </p>
            <p>
              <span className="font-medium text-foreground">Nomor Resi:</span>{" "}
              {detail.shipping_tracking_number || "Belum tersedia"}
            </p>
            <p>
              <span className="font-medium text-foreground">Metode Pembayaran:</span>{" "}
              {detail.payment_method || "-"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-foreground">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            {detail.items.map((item) => (
              <div
                key={`${item.order_item_id ?? item.product_id}`}
                className="flex items-center justify-between gap-3"
              >
                <span>
                  {item.product_name} x {item.quantity}
                </span>
                <span>{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
            <div className="pt-2 font-semibold text-foreground border-t border-border">
              Total: {formatCurrency(detail.total)}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-border"
          onClick={onRetry}
          disabled={loading}
        >
          {loading ? "Memuat..." : "Muat Ulang Status"}
        </Button>
        <Button
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
