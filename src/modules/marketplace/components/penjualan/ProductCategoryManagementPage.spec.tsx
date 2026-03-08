/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { ProductCategoryManagementPage } from "./ProductCategoryManagementPage";

const mockUseInventoryCategories = vi.fn();

vi.mock("@/hooks/queries/inventory", () => ({
  useInventoryCategories: () => mockUseInventoryCategories(),
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

describe("ProductCategoryManagementPage", () => {
  it("shows active and inactive category states", () => {
    mockUseInventoryCategories.mockReturnValue({
      data: [
        { id: 1, name: "Pangan", count: 4, is_active: true },
        { id: 2, name: "Kerajinan", count: 2, is_active: false },
      ],
      isLoading: false,
      isError: false,
    });

    renderWithClient(<ProductCategoryManagementPage />);

    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("Nonaktif")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nonaktifkan" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Aktifkan" })).toBeTruthy();
  });
});
