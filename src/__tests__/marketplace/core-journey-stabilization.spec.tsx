/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CheckoutForm } from "@/modules/marketplace/components/checkout/checkout-form";
import type {
  MarketplaceCartItemResponse,
  MarketplaceCartResponse,
  MarketplaceOrderResponse,
} from "@/types/api/marketplace";

const checkoutMarketplaceMock = vi.fn();
const saveBuyerOrderContextMock = vi.fn();
const showToastErrorMock = vi.fn();

vi.mock("@/services/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/services/api")>();
  return {
    ...actual,
    checkoutMarketplace: (...args: any[]) => checkoutMarketplaceMock(...args),
  };
});

vi.mock("@/modules/marketplace/state/buyer-checkout-context", () => ({
  saveBuyerOrderContext: (...args: any[]) => saveBuyerOrderContextMock(...args),
}));

vi.mock("@/lib/toast", () => ({
  showToastError: (...args: any[]) => showToastErrorMock(...args),
  showToastSuccess: vi.fn(),
}));

function renderWithClient(ui: ReactNode) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

function makeCart(): MarketplaceCartResponse {
  const item: MarketplaceCartItemResponse = {
    id: 1,
    product_id: 100,
    product_name: "Kopi Arabika",
    product_sku: "KOP-001",
    quantity: 1,
    price: 25000,
    subtotal: 25000,
    track_stock: true,
    stock: 10,
    in_stock: true,
  };

  return {
    id: 1,
    status: "OPEN",
    items: [item],
    total: 25000,
    item_count: 1,
  };
}

function fillCheckoutForm() {
  fireEvent.change(screen.getByPlaceholderText("contoh@email.com"), {
    target: { value: "buyer@example.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("812-3456-7890"), {
    target: { value: "081212345678" },
  });
  fireEvent.change(screen.getByPlaceholderText("Nama Lengkap Penerima"), {
    target: { value: "Budi Santoso" },
  });
  fireEvent.change(screen.getByPlaceholderText("0812xxxx"), {
    target: { value: "081212300000" },
  });
  fireEvent.change(
    screen.getByPlaceholderText(
      "Nama Jalan, No. Rumah, RT/RW, Patokan (Cth: Seberang Masjid Al-Ikhlas)"
    ),
    {
      target: { value: "Jl. Melati No. 10" },
    }
  );
  fireEvent.change(screen.getByPlaceholderText("Pilih Provinsi"), {
    target: { value: "Jawa Barat" },
  });
  fireEvent.change(screen.getByPlaceholderText("Pilih Kota/Kabupaten"), {
    target: { value: "Bandung" },
  });
  fireEvent.change(screen.getByPlaceholderText("Pilih Kecamatan"), {
    target: { value: "Coblong" },
  });
  fireEvent.change(screen.getByPlaceholderText("Contoh: 16750"), {
    target: { value: "40132" },
  });
}

function successEnvelope(order: MarketplaceOrderResponse) {
  return {
    success: true,
    message: "ok",
    data: order,
    meta: {
      request_id: "req-1",
      timestamp: new Date().toISOString(),
    },
    errors: null,
  };
}

describe("core buyer checkout stabilization", () => {
  beforeEach(() => {
    checkoutMarketplaceMock.mockReset();
    saveBuyerOrderContextMock.mockReset();
    showToastErrorMock.mockReset();
  });

  it("keeps checkout submit disabled until required data is complete", async () => {
    renderWithClient(<CheckoutForm cart={makeCart()} onSuccess={vi.fn()} />);

    const submitButton = screen.getByRole("button", { name: /Bayar Sekarang/i });
    expect((submitButton as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(checkoutMarketplaceMock).not.toHaveBeenCalled();
      expect(showToastErrorMock).toHaveBeenCalledTimes(0);
    });
  });

  it("prevents duplicate submit while checkout request is still in flight", async () => {
    const onSuccess = vi.fn();
    let resolveRequest: ((value: any) => void) | undefined;

    checkoutMarketplaceMock.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    renderWithClient(<CheckoutForm cart={makeCart()} onSuccess={onSuccess} />);

    fillCheckoutForm();

    const submitButton = screen.getByRole("button", { name: /Bayar Sekarang/i });
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    expect(checkoutMarketplaceMock).toHaveBeenCalledTimes(1);

    resolveRequest?.(
      successEnvelope({
        id: 99,
        status: "PENDING_PAYMENT",
        fulfillment_method: "DELIVERY",
        customer_name: "Budi Santoso",
        customer_phone: "081212300000",
        customer_email: "buyer@example.com",
        customer_address: "Jl. Melati No. 10",
        notes: "-",
        total: 25000,
        items: [
          {
            order_item_id: 11,
            product_id: 100,
            product_name: "Kopi Arabika",
            product_sku: "KOP-001",
            quantity: 1,
            price: 25000,
            subtotal: 25000,
          },
        ],
        created_at: 1739491200,
      })
    );

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(saveBuyerOrderContextMock).toHaveBeenCalledTimes(1);
    });
  });
});
