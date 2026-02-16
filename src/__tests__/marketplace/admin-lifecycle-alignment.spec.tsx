/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { OrderDetailPage } from "@/modules/marketplace/components/penjualan/OrderDetailPage";
import { OrderListPage } from "@/modules/marketplace/components/penjualan/OrderListPage";
import * as statusUtils from "@/modules/marketplace/utils/status";

const pushMock = vi.fn();
const confirmMock = vi.fn(async () => true);
const updateStatusMock = vi.fn(async () => ({}));

let ordersMock: any[] = [];
let orderDetailMock: any = null;
const useMarketplaceOrdersMock = vi.fn();
const useMarketplaceOrderMock = vi.fn();
let tableOrdersSnapshot: any[] = [];

vi.mock("@/modules/marketplace/components/penjualan/OrderTable", () => ({
  OrderTable: ({ orders, getActions }: any) => {
    tableOrdersSnapshot = orders;
    return (
      <div>
        {orders.map((order: any) => (
          <div key={order.id}>
            {(getActions?.(order) ?? []).map((action: any) => (
              <button
                key={`${order.id}-${action.label}`}
                type="button"
                disabled={action.disabled}
                onClick={() => action.onSelect(order)}
              >
                {action.label}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("@/components/shared/confirm-dialog-provider", () => ({
  useConfirm: () => confirmMock,
}));

vi.mock("@/modules/marketplace/order/components/order-invoice-dialog", () => ({
  OrderInvoiceDialog: () => null,
}));

vi.mock("@/hooks/queries/marketplace-orders", () => ({
  useMarketplaceOrders: (params: Record<string, unknown>) => {
    useMarketplaceOrdersMock(params);
    return {
      data: { items: ordersMock, total: ordersMock.length },
      isLoading: false,
      isError: false,
      error: null,
    };
  },
  useMarketplaceOrder: (id: string) => {
    useMarketplaceOrderMock(id);
    return {
      data: orderDetailMock,
      isLoading: false,
      isError: false,
      error: null,
    };
  },
  useMarketplaceOrderActions: () => ({
    updateStatus: {
      mutateAsync: updateStatusMock,
      isPending: false,
    },
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function makeOrder(status: string) {
  return {
    id: 101,
    order_number: "INV-2026-0001",
    status,
    customer_name: "Budi",
    customer_email: "budi@email.com",
    total: 250000,
    created_at: 1739491200,
  };
}

function makeOrderDetail(status: string) {
  return {
    id: 101,
    order_number: "INV-2026-0001",
    status,
    fulfillment_method: "DELIVERY",
    customer_name: "Budi",
    customer_phone: "08123456789",
    customer_email: "budi@email.com",
    customer_address: "Jl. Melati No. 10",
    total: 250000,
    items: [
      {
        product_name: "Kopi Arabika",
        product_sku: "KOP-AR-01",
        price: 125000,
        quantity: 2,
        subtotal: 250000,
      },
    ],
    created_at: 1739491200,
    updated_at: 1739492200,
    payment_method: "Transfer Bank",
    payment_reference: "REF-101",
    shipping_method: "JNE",
    shipping_tracking_number: "JNE-001",
    guest_tracking_enabled: true,
    tracking_token: "track-abc-123",
    review_state: "submitted",
    review_submitted_at: 1739493000,
    manual_payment: {
      status: "PAYMENT_VERIFICATION",
      proof_url: "https://example.com/proof.jpg",
      note: "Sudah sesuai bukti transfer",
      bank_name: "BCA",
      account_name: "BUMDes Maju",
      transfer_amount: 250000,
      transfer_date: "2026-02-14",
      created_at: 1739492100,
      updated_at: 1739492200,
    },
  };
}

describe("admin marketplace lifecycle alignment", () => {
  beforeEach(() => {
    ordersMock = [];
    orderDetailMock = null;
    tableOrdersSnapshot = [];
    pushMock.mockClear();
    confirmMock.mockClear();
    updateStatusMock.mockClear();
    useMarketplaceOrdersMock.mockClear();
    useMarketplaceOrderMock.mockClear();
  });

  it("normalizes legacy statuses and maps status filter to canonical query", async () => {
    ordersMock = [makeOrder("PAID")];

    render(<OrderListPage />);

    expect(tableOrdersSnapshot[0]?.status).toBe("PAYMENT_VERIFICATION");
    expect(useMarketplaceOrdersMock).toHaveBeenCalledWith(
      expect.objectContaining({ status: undefined }),
    );

    fireEvent.change(screen.getByLabelText("Filter status"), {
      target: { value: "PAYMENT_VERIFICATION" },
    });

    await waitFor(() => {
      expect(useMarketplaceOrdersMock).toHaveBeenLastCalledWith(
        expect.objectContaining({ status: "PAYMENT_VERIFICATION" }),
      );
    });
  });

  it("submits canonical next status from order list action", async () => {
    ordersMock = [makeOrder("PAYMENT_VERIFICATION")];

    render(<OrderListPage />);

    fireEvent.click(screen.getByRole("button", { name: "Proses Pesanan" }));

    await waitFor(() => {
      expect(updateStatusMock).toHaveBeenCalledWith({
        id: 101,
        payload: { status: "PROCESSING", reason: undefined },
      });
    });
  });

  it("blocks invalid transition in detail status modal", async () => {
    orderDetailMock = makeOrderDetail("PROCESSING");
    const transitionGuard = vi
      .spyOn(statusUtils, "isMarketplaceTransitionAllowed")
      .mockReturnValue(false);

    render(<OrderDetailPage id="101" />);

    fireEvent.click(screen.getByRole("button", { name: "Update Status" }));
    fireEvent.click(screen.getByRole("button", { name: "Perbarui Status" }));

    await waitFor(() => {
      expect(updateStatusMock).not.toHaveBeenCalled();
    });

    transitionGuard.mockRestore();
  });

  it("shows buyer support signals in admin detail transaction info", () => {
    orderDetailMock = makeOrderDetail("IN_DELIVERY");

    render(<OrderDetailPage id="101" />);

    expect(screen.getByText("Akses Tracking Tamu")).toBeTruthy();
    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("track-abc-123")).toBeTruthy();
    expect(screen.getByText("Ulasan Terkirim")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Lihat Bukti" })).toBeTruthy();
    expect(screen.getByText("Sudah sesuai bukti transfer")).toBeTruthy();
  });
});
