/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusDetailFeature } from "@/modules/marketplace/components/shipping/status-detail-feature";
import type { MarketplaceGuestOrderStatusDetailResponse } from "@/types/api/marketplace";

const baseDetail: MarketplaceGuestOrderStatusDetailResponse = {
  id: 77,
  order_number: "ORD-2026-077",
  status: "PROCESSING",
  total: 120000,
  payment_method: "MANUAL_TRANSFER",
  shipping_method: "DELIVERY",
  shipping_tracking_number: "",
  review_state: "not_eligible",
  items: [
    {
      order_item_id: 1,
      product_id: 10,
      product_name: "Kopi Biji",
      product_sku: "KOP-10",
      quantity: 2,
      price: 60000,
      subtotal: 120000,
    },
  ],
  status_history: [
    { status: "PENDING_PAYMENT", timestamp: 1739491200 },
    { status: "PAYMENT_VERIFICATION", timestamp: 1739491800 },
    { status: "PROCESSING", timestamp: 1739492400 },
  ],
};

describe("tracking status stepper", () => {
  it("renders canceled path clearly with cancel reason", () => {
    render(
      <StatusDetailFeature
        detail={{
          ...baseDetail,
          status: "CANCELED",
          status_history: [
            { status: "PENDING_PAYMENT", timestamp: 1739491200 },
            { status: "PAYMENT_VERIFICATION", timestamp: 1739491800 },
            {
              status: "CANCELED",
              timestamp: 1739492800,
              reason: "Pembayaran tidak valid",
            },
          ],
        }}
        orderNumber="ORD-2026-077"
        onRetry={() => undefined}
        onReset={() => undefined}
        onOpenReview={() => undefined}
      />
    );

    expect(
      screen.getByTestId("marketplace-tracking-timeline-step-canceled")
    ).toBeTruthy();
    expect(screen.getByText("Pembayaran tidak valid")).toBeTruthy();
    expect(screen.getAllByText("Dibatalkan").length).toBeGreaterThan(0);
  });

  it("keeps one active step for non terminal processing state", () => {
    render(
      <StatusDetailFeature
        detail={baseDetail}
        orderNumber="ORD-2026-077"
        onRetry={() => undefined}
        onReset={() => undefined}
        onOpenReview={() => undefined}
      />
    );

    expect(screen.getByTestId("marketplace-tracking-timeline-step-processing")).toBeTruthy();
    expect(screen.getByText("Sedang Berjalan")).toBeTruthy();
    expect(screen.queryByTestId("marketplace-tracking-timeline-step-canceled")).toBeNull();
  });
});
