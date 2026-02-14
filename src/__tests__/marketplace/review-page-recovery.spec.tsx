/** @format */

// @vitest-environment jsdom
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MarketplaceReviewPage } from "@/modules/marketplace/review-page";

const searchParams = new URLSearchParams("");

vi.mock("next/navigation", () => ({
  useSearchParams: () => searchParams,
}));

vi.mock("@/services/api", () => ({
  getMarketplaceGuestOrderStatus: vi.fn(),
  submitMarketplaceOrderReview: vi.fn(),
}));

vi.mock("@/lib/toast", () => ({
  showToastError: vi.fn(),
  showToastSuccess: vi.fn(),
}));

function renderWithClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>
      <MarketplaceReviewPage />
    </QueryClientProvider>
  );
}

describe("marketplace review recovery page", () => {
  beforeEach(() => {
    searchParams.delete("order_id");
    searchParams.delete("tracking_token");
  });

  it("supports quick review overlay flow when tracking params are absent", async () => {
    renderWithClient();

    fireEvent.click(
      screen.getByRole("button", { name: /Buka Konfirmasi Pesanan/i })
    );

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /Konfirmasi Pesanan Diterima/i })
      ).toBeTruthy();
    });

    const submitButton = screen.getByRole("button", {
      name: /Konfirmasi & Selesai/i,
    }) as HTMLButtonElement;
    expect(submitButton.disabled).toBe(true);

    fireEvent.click(screen.getByLabelText("Bintang 5"));
    fireEvent.change(screen.getByLabelText(/Tulis Ulasan Anda/i), {
      target: { value: "Produk diterima dengan baik." },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  });
});
