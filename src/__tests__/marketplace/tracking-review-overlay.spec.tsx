/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { MarketplaceShippingPage } from "@/modules/marketplace/shipping-page";

const trackMarketplaceOrderMock = vi.fn();
const getMarketplaceGuestOrderStatusMock = vi.fn();
const submitMarketplaceOrderReviewMock = vi.fn();

vi.mock("@/modules/marketplace/hooks/useMarketplaceProducts", () => ({
  useMarketplaceCart: () => ({
    data: { item_count: 2, items: [{ id: 1 }], total: 100000 },
  }),
}));

vi.mock("@/services/api", () => ({
  trackMarketplaceOrder: (...args: any[]) => trackMarketplaceOrderMock(...args),
  getMarketplaceGuestOrderStatus: (...args: any[]) =>
    getMarketplaceGuestOrderStatusMock(...args),
  submitMarketplaceOrderReview: (...args: any[]) =>
    submitMarketplaceOrderReviewMock(...args),
}));

vi.mock("@/lib/toast", () => ({
  showToastSuccess: vi.fn(),
  showToastError: vi.fn(),
}));

function responseSuccess<T>(data: T) {
  return {
    success: true,
    message: "ok",
    data,
    meta: {
      request_id: "req-1",
      timestamp: new Date().toISOString(),
    },
    errors: null,
  };
}

function responseError(message: string) {
  return {
    success: false,
    message,
    data: null,
    meta: {
      request_id: "req-2",
      timestamp: new Date().toISOString(),
    },
    errors: {
      error: [message],
    },
  };
}

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("tracking and review overlay flow", () => {
  beforeEach(() => {
    trackMarketplaceOrderMock.mockReset();
    getMarketplaceGuestOrderStatusMock.mockReset();
    submitMarketplaceOrderReviewMock.mockReset();
  });

  it("validates tracking input and shows not-found branch from backend", async () => {
    trackMarketplaceOrderMock.mockResolvedValue(responseError("order not found"));

    renderWithClient(<MarketplaceShippingPage />);

    fireEvent.click(screen.getByRole("button", { name: "Lacak Pesanan Saya" }));
    expect(screen.getByText("Lengkapi data pelacakan terlebih dahulu.")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Kode Pesanan"), {
      target: { value: "ORD-2026-404" },
    });
    fireEvent.change(screen.getByLabelText("Email / Nomor HP"), {
      target: { value: "buyer@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lacak Pesanan Saya" }));

    await waitFor(() => {
      expect(screen.getByText("Pesanan Tidak Ditemukan")).toBeTruthy();
      expect(
        screen.getByText(/Periksa kode pesanan dan email\/nomor HP/i)
      ).toBeTruthy();
    });
  });

  it("loads status detail and submits eligible review to backend", async () => {
    trackMarketplaceOrderMock.mockResolvedValue(
      responseSuccess({
        order_id: 44,
        order_number: "ORD-2026-044",
        status: "COMPLETED",
        tracking_token: "token-123",
      })
    );

    getMarketplaceGuestOrderStatusMock.mockResolvedValue(
      responseSuccess({
        id: 44,
        order_number: "ORD-2026-044",
        status: "COMPLETED",
        total: 50000,
        payment_method: "MANUAL_TRANSFER",
        shipping_method: "JNE",
        shipping_tracking_number: "JNE-001",
        review_state: "eligible",
        items: [
          {
            order_item_id: 11,
            product_id: 1,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
        status_history: [
          { status: "PENDING_PAYMENT", timestamp: 1739491200 },
          { status: "COMPLETED", timestamp: 1739494800 },
        ],
      })
    );

    submitMarketplaceOrderReviewMock.mockResolvedValue(responseSuccess(null));

    renderWithClient(<MarketplaceShippingPage />);

    fireEvent.change(screen.getByLabelText("Kode Pesanan"), {
      target: { value: "ORD-2026-044" },
    });
    fireEvent.change(screen.getByLabelText("Email / Nomor HP"), {
      target: { value: "buyer@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lacak Pesanan Saya" }));

    await waitFor(() => {
      expect(screen.getByText("Status Pesanan")).toBeTruthy();
      expect(screen.getByText("Detail Pengiriman")).toBeTruthy();
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Konfirmasi Pesanan Diterima" })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Konfirmasi Pesanan Diterima" })
      ).toBeTruthy();
    });

    fireEvent.click(screen.getByLabelText("Bintang 5"));
    fireEvent.click(screen.getByRole("button", { name: "Konfirmasi & Selesai" }));

    await waitFor(() => {
      expect(submitMarketplaceOrderReviewMock).toHaveBeenCalledWith(44, {
        tracking_token: "token-123",
        overall_comment: undefined,
        items: [
          {
            order_item_id: 11,
            rating: 5,
            comment: undefined,
          },
        ],
      });
    });
  });
});
