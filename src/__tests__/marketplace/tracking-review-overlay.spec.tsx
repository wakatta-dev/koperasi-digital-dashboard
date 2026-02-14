/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MarketplaceReviewPage } from "@/modules/marketplace/review-page";
import { MarketplaceShippingPage } from "@/modules/marketplace/shipping-page";

vi.mock("@/modules/marketplace/hooks/useMarketplaceProducts", () => ({
  useMarketplaceCart: () => ({
    data: { item_count: 2, items: [{ id: 1 }], total: 100000 },
  }),
}));

vi.mock("@/lib/toast", () => ({
  showToastSuccess: vi.fn(),
}));

describe("tracking and review overlay flow", () => {
  it("preserves tracking placeholders and supports not-found to success transition", async () => {
    render(<MarketplaceShippingPage />);

    expect(screen.getByText("Lacak Pesanan Anda")).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Contoh: INV-20231024-0001"),
    ).toBeTruthy();
    expect(
      screen.getByPlaceholderText("Contoh: budi@email.com atau 0812..."),
    ).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Kode Pesanan"), {
      target: { value: "INV-INVALID" },
    });
    fireEvent.change(screen.getByLabelText("Email / Nomor HP"), {
      target: { value: "x@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lacak Pesanan Saya" }));

    expect(screen.getByText("Pesanan Tidak Ditemukan")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Kode Pesanan"), {
      target: { value: "INV-20231024-0001" },
    });
    fireEvent.change(screen.getByLabelText("Email / Nomor HP"), {
      target: { value: "budi@email.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Lacak Pesanan Saya" }));

    await waitFor(() => {
      expect(screen.getByText("Status Pesanan")).toBeTruthy();
      expect(screen.getByText("Detail Pengiriman")).toBeTruthy();
    });
  });

  it("supports keyboard close and focus return for review overlay", async () => {
    render(<MarketplaceReviewPage />);

    const trigger = screen.getByRole("button", {
      name: "Buka Konfirmasi Pesanan",
    });
    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByText("Konfirmasi Pesanan Diterima")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByText("Konfirmasi Pesanan Diterima")).toBeNull();
      expect(document.activeElement).toBe(trigger);
    });
  });
});
