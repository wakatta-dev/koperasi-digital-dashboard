/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { MarketplaceConfirmationPage } from "@/modules/marketplace/confirmation-page";
import { MarketplacePaymentPage } from "@/modules/marketplace/payment-page";

const pushMock = vi.fn();
let currentSearchParams = new URLSearchParams();

const useMarketplaceGuestOrderStatusMock = vi.fn();
const submitMarketplaceManualPaymentMock = vi.fn();
const trackMarketplaceOrderMock = vi.fn();
const attachBuyerManualPaymentMock = vi.fn();
const getBuyerOrderContextMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => currentSearchParams,
  usePathname: () => "/marketplace/pembayaran",
}));

vi.mock("@/modules/marketplace/hooks/useMarketplaceProducts", () => ({
  useMarketplaceCart: () => ({
    data: { item_count: 1, items: [{ id: 1 }], total: 50000 },
  }),
}));

vi.mock("@/hooks/queries/marketplace-orders", () => ({
  useMarketplaceGuestOrderStatus: (...args: any[]) =>
    useMarketplaceGuestOrderStatusMock(...args),
}));

vi.mock("@/services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/api")>();
  return {
    ...actual,
    submitMarketplaceManualPayment: (...args: any[]) =>
      submitMarketplaceManualPaymentMock(...args),
    trackMarketplaceOrder: (...args: any[]) => trackMarketplaceOrderMock(...args),
  };
});

vi.mock("@/modules/marketplace/state/buyer-checkout-context", () => ({
  getBuyerOrderContext: (...args: any[]) => getBuyerOrderContextMock(...args),
  readBuyerOrderContext: (...args: any[]) => {
    const context = getBuyerOrderContextMock(...args);
    return {
      context,
      state: context ? "fresh" : "missing",
      ageMs: context ? 1000 : undefined,
    };
  },
  BUYER_ORDER_CONTEXT_TTL_MS: 24 * 60 * 60 * 1000,
  attachBuyerManualPayment: (...args: any[]) => attachBuyerManualPaymentMock(...args),
}));

vi.mock("@/lib/toast", () => ({
  showToastSuccess: vi.fn(),
  showToastError: vi.fn(),
}));

function successResponse<T>(data: T) {
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

describe("payment and confirmation context integrity", () => {
  beforeEach(() => {
    pushMock.mockReset();
    useMarketplaceGuestOrderStatusMock.mockReset();
    submitMarketplaceManualPaymentMock.mockReset();
    trackMarketplaceOrderMock.mockReset();
    attachBuyerManualPaymentMock.mockReset();
    getBuyerOrderContextMock.mockReset();
    currentSearchParams = new URLSearchParams();
  });

  it("submits manual payment proof with real order id and navigates to confirmation", async () => {
    currentSearchParams = new URLSearchParams("order_id=55");

    useMarketplaceGuestOrderStatusMock.mockReturnValue({
      data: {
        id: 55,
        order_number: "ORD-2026-055",
        status: "PENDING_PAYMENT",
        total: 50000,
        items: [
          {
            order_item_id: 12,
            product_id: 1,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    getBuyerOrderContextMock.mockReturnValue({
      order: {
        id: 55,
        status: "PENDING_PAYMENT",
        fulfillment_method: "DELIVERY",
        customer_name: "Budi Santoso",
        customer_phone: "081212300000",
        customer_email: "buyer@example.com",
        customer_address: "Jl. Melati No. 10",
        notes: "-",
        total: 50000,
        items: [
          {
            order_item_id: 12,
            product_id: 1,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
        created_at: 1739491200,
      },
      checkout: {
        customerName: "Budi Santoso",
        customerPhone: "081212300000",
        customerEmail: "buyer@example.com",
        customerAddress: "Jl. Melati No. 10",
        shippingOption: "REGULER",
        paymentMethod: "TRANSFER_BANK",
        submittedAt: Date.now(),
      },
    });
    trackMarketplaceOrderMock.mockResolvedValue(
      successResponse({
        order_id: 55,
        order_number: "ORD-2026-055",
        status: "PENDING_PAYMENT",
        tracking_token: "track-55",
      })
    );

    submitMarketplaceManualPaymentMock.mockResolvedValue(
      successResponse({
        status: "MANUAL_PAYMENT_SUBMITTED",
        proof_url: "https://example.com/proof.png",
        proof_filename: "proof.png",
        created_at: 1739491200,
        updated_at: 1739491200,
      })
    );

    const { container } = render(<MarketplacePaymentPage />);

    const input = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["proof"], "proof.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [file] } });

    fireEvent.click(
      await screen.findByRole("button", { name: "Konfirmasi Pembayaran Saya" })
    );

    await waitFor(() => {
      expect(trackMarketplaceOrderMock).toHaveBeenCalledWith({
        order_number: "ORD-2026-055",
        contact: "buyer@example.com",
      });
      expect(submitMarketplaceManualPaymentMock).toHaveBeenCalledWith(
        55,
        expect.objectContaining({
          file,
          tracking_token: "track-55",
          bank_name: "Bank BRI",
          account_name: "BUMDes Sukamaju",
          transfer_amount: 50000,
        })
      );
      expect(attachBuyerManualPaymentMock).toHaveBeenCalledTimes(1);
      expect(pushMock).toHaveBeenCalledWith(
        "/marketplace/konfirmasi?order_id=55&tracking_token=track-55"
      );
    });
  });

  it("renders confirmation page from backend-backed order context", () => {
    currentSearchParams = new URLSearchParams("order_id=55&tracking_token=track-55");

    useMarketplaceGuestOrderStatusMock.mockReturnValue({
      data: {
        id: 55,
        order_number: "ORD-2026-055",
        status: "PAYMENT_VERIFICATION",
        total: 50000,
        items: [
          {
            order_item_id: 12,
            product_id: 1,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
      },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    getBuyerOrderContextMock.mockReturnValue(null);

    render(<MarketplaceConfirmationPage />);

    expect(screen.getByText("Pesanan Berhasil Dibuat")).toBeTruthy();
    expect(screen.getByText("#ORD-2026-055")).toBeTruthy();
    expect(screen.getByText("Kopi Arabika x 1")).toBeTruthy();
  });

  it("shows local-context indicator when backend detail is unavailable", () => {
    currentSearchParams = new URLSearchParams("order_id=77");

    useMarketplaceGuestOrderStatusMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    getBuyerOrderContextMock.mockReturnValue({
      order: {
        id: 77,
        status: "PENDING_PAYMENT",
        fulfillment_method: "DELIVERY",
        customer_name: "Sinta",
        customer_phone: "081212300000",
        customer_email: "buyer@example.com",
        customer_address: "Jl. Melati No. 10",
        notes: "-",
        total: 50000,
        items: [
          {
            order_item_id: 12,
            product_id: 1,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 50000,
            subtotal: 50000,
          },
        ],
        created_at: 1739491200,
      },
      checkout: {
        customerName: "Sinta",
        customerPhone: "081212300000",
        customerEmail: "buyer@example.com",
        customerAddress: "Jl. Melati No. 10",
        shippingOption: "REGULER",
        paymentMethod: "TRANSFER_BANK",
        submittedAt: Date.now(),
      },
    });

    render(<MarketplacePaymentPage />);
    expect(
      screen.getByText(/detail ini berasal dari context lokal sementara/i)
    ).toBeTruthy();

    render(<MarketplaceConfirmationPage />);
    expect(
      screen.getByText(/konfirmasi backend belum tersedia/i)
    ).toBeTruthy();
  });
});
