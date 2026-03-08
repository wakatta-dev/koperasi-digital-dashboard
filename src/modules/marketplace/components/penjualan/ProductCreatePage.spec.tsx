/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductCreatePage } from "./ProductCreatePage";

const pushMock = vi.fn();
const mockUseInventoryCategories = vi.fn();
const mockUseInventoryActions = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
    success: vi.fn(),
  },
}));

vi.mock("@/hooks/queries/inventory", () => ({
  useInventoryCategories: () => mockUseInventoryCategories(),
  useInventoryActions: () => mockUseInventoryActions(),
}));

function renderWithClient(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ProductCreatePage", () => {
  it("defaults marketplace visibility to draft internal guidance", () => {
    mockUseInventoryCategories.mockReturnValue({
      data: [{ id: 1, name: "Pangan", count: 1, is_active: true }],
      isLoading: false,
      isError: false,
    });
    mockUseInventoryActions.mockReturnValue({
      create: { isPending: false, mutateAsync: vi.fn() },
      update: { isPending: false, mutateAsync: vi.fn() },
      addImage: { isPending: false, mutateAsync: vi.fn() },
      initialStock: { isPending: false, mutateAsync: vi.fn() },
    });

    renderWithClient(<ProductCreatePage />);

    expect(
      screen.getByText(
        "Produk baru akan disimpan sebagai draft internal. Sistem hanya mempublikasikan jika data produk sudah lengkap.",
      ),
    ).toBeTruthy();
    const switches = screen.getAllByRole("switch");
    expect(switches[2]?.getAttribute("data-state")).toBe("unchecked");
  });
});
