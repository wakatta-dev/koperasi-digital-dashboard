/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { CheckoutForm } from "@/modules/marketplace/components/checkout/checkout-form";
import { FiltersSidebar } from "@/modules/marketplace/components/filters/filters-sidebar";
import { MarketplaceHeader } from "@/modules/marketplace/components/layout/header";
import { OrderSummaryCard } from "@/modules/marketplace/components/order/order-summary-card";
import type {
  MarketplaceCartItemResponse,
  MarketplaceCartResponse,
} from "@/types/api/marketplace";

function renderWithQueryClient(ui: ReactNode) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
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

describe("buyer feature components extraction", () => {
  it("preserves catalog header placeholder and indigo primary action", () => {
    render(
      <MarketplaceHeader
        searchValue=""
        onSearchChange={vi.fn()}
        onSubmit={vi.fn()}
      />,
    );

    expect(screen.getByText("Pasar Desa Digital")).toBeTruthy();
    expect(screen.getByPlaceholderText("Cari produk desa...")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Lacak Pesanan" })).toBeTruthy();

    const searchButton = screen.getByRole("button", { name: "Cari" });
    expect(searchButton.className).toContain("bg-indigo-600");
  });

  it("keeps filter placeholders and apply interaction", () => {
    const onApply = vi.fn();

    render(
      <FiltersSidebar
        filters={{ categories: ["all"], producer: "all" }}
        onChange={vi.fn()}
        onApply={onApply}
      />,
    );

    expect(screen.getByPlaceholderText("Min")).toBeTruthy();
    expect(screen.getByPlaceholderText("Max")).toBeTruthy();

    const applyButton = screen.getByRole("button", { name: "Terapkan" });
    expect(applyButton.className).toContain("bg-indigo-600");

    fireEvent.click(applyButton);
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it("keeps checkout placeholders and supports payment option selection", () => {
    renderWithQueryClient(
      <CheckoutForm cart={makeCart()} onSuccess={vi.fn()} />,
    );

    expect(screen.getByPlaceholderText("contoh@email.com")).toBeTruthy();
    expect(screen.getByPlaceholderText("812-3456-7890")).toBeTruthy();
    expect(screen.getByPlaceholderText("Nama Lengkap Penerima")).toBeTruthy();
    expect(
      screen.getByPlaceholderText(
        "Nama Jalan, No. Rumah, RT/RW, Patokan (Cth: Seberang Masjid Al-Ikhlas)",
      ),
    ).toBeTruthy();

    const qrisButton = screen.getByRole("button", { name: /QRIS/i });
    fireEvent.click(qrisButton);
    expect(qrisButton.className).toContain("border-indigo-600");

    const payButton = screen.getByRole("button", { name: "Bayar Sekarang" });
    expect(payButton.className).toContain("bg-indigo-600");
  });

  it("keeps cart summary promo input and indigo checkout action", () => {
    render(<OrderSummaryCard subtotal={100000} total={116000} itemCount={2} />);

    expect(screen.getByPlaceholderText("Masukkan kode promo")).toBeTruthy();

    const applyPromo = screen.getByRole("button", { name: "Gunakan" });
    expect(applyPromo.className).toContain("bg-indigo-600");
    expect(screen.getByText("Total Tagihan")).toBeTruthy();
  });
});
