/** @format */

import { Button } from "@/components/ui/button";
import type { MarketplaceOrderStatus } from "@/types/api/marketplace";
import { getMarketplaceCanonicalStatusLabel } from "@/modules/marketplace/utils/status";

type TimelineStep = {
  status: MarketplaceOrderStatus;
  done: boolean;
};

type ShippingStatusDetail = {
  orderNumber: string;
  status: MarketplaceOrderStatus;
  shippingMethod: string;
  trackingNumber?: string;
  customerName: string;
  customerAddress: string;
  totalLabel: string;
};

type StatusDetailFeatureProps = {
  detail: ShippingStatusDetail;
  onChangeVariant: (next: "verification" | "delivery") => void;
  onOpenReview: () => void;
};

const TIMELINE_STEPS: MarketplaceOrderStatus[] = [
  "PENDING_PAYMENT",
  "PAYMENT_VERIFICATION",
  "PROCESSING",
  "IN_DELIVERY",
  "COMPLETED",
];

function buildTimeline(status: MarketplaceOrderStatus): TimelineStep[] {
  const activeIndex = TIMELINE_STEPS.indexOf(status);
  return TIMELINE_STEPS.map((step, index) => ({
    status: step,
    done: index <= Math.max(activeIndex, 0),
  }));
}

export function StatusDetailFeature({
  detail,
  onChangeVariant,
  onOpenReview,
}: StatusDetailFeatureProps) {
  const timeline = buildTimeline(detail.status);

  return (
    <section className="mx-auto w-full max-w-5xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">Status Pesanan</h2>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600">
            {detail.orderNumber}
          </span>
        </div>

        <ol className="space-y-3" aria-label="Timeline status pesanan">
          {timeline.map((step) => (
            <li key={step.status} className="flex items-center gap-3">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  step.done
                    ? "bg-indigo-600 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step.done ? "✓" : "•"}
              </span>
              <span
                className={`text-sm ${
                  step.done ? "font-semibold text-foreground" : "text-muted-foreground"
                }`}
              >
                {getMarketplaceCanonicalStatusLabel(step.status)}
              </span>
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
              {detail.shippingMethod}
            </p>
            <p>
              <span className="font-medium text-foreground">Nomor Resi:</span>{" "}
              {detail.trackingNumber ?? "Belum tersedia"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-3 text-base font-bold text-foreground">Ringkasan Pesanan</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Nama:</span> {detail.customerName}
            </p>
            <p>
              <span className="font-medium text-foreground">Alamat:</span> {detail.customerAddress}
            </p>
            <p>
              <span className="font-medium text-foreground">Total Belanja:</span>{" "}
              {detail.totalLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="border-border"
          onClick={() => onChangeVariant("verification")}
        >
          Lihat Verifikasi Pembayaran
        </Button>
        <Button
          type="button"
          variant="outline"
          className="border-border"
          onClick={() => onChangeVariant("delivery")}
        >
          Lihat Dalam Pengiriman
        </Button>
        <Button type="button" className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={onOpenReview}>
          Konfirmasi Pesanan Diterima
        </Button>
      </div>
    </section>
  );
}
