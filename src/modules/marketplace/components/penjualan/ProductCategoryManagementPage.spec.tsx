/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProductCategoryManagementPage } from "./ProductCategoryManagementPage";

const mockUseInventoryCategories = vi.fn();
const mockUseInventoryActions = vi.fn();

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

describe("ProductCategoryManagementPage", () => {
  beforeEach(() => {
    mockUseInventoryCategories.mockReset();
    mockUseInventoryActions.mockReset();
  });

  it("shows active and inactive category states", () => {
    mockUseInventoryCategories.mockReturnValue({
      data: [
        { id: 1, name: "Pangan", count: 4, is_active: true },
        { id: 2, name: "Kerajinan", count: 2, is_active: false },
      ],
      isLoading: false,
      isError: false,
    });
    mockUseInventoryActions.mockReturnValue({
      createCategory: { isPending: false, mutateAsync: vi.fn() },
      updateCategory: { isPending: false, mutateAsync: vi.fn() },
    });

    renderWithClient(<ProductCategoryManagementPage />);

    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("Nonaktif")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nonaktifkan" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Aktifkan" })).toBeTruthy();
  });

  it("creates a new category from the dialog", async () => {
    const createCategory = vi.fn().mockResolvedValue(undefined);
    mockUseInventoryCategories.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
    mockUseInventoryActions.mockReturnValue({
      createCategory: { isPending: false, mutateAsync: createCategory },
      updateCategory: { isPending: false, mutateAsync: vi.fn() },
    });

    renderWithClient(<ProductCategoryManagementPage />);

    fireEvent.click(screen.getByRole("button", { name: "Tambah Kategori" }));
    fireEvent.change(screen.getByLabelText("Nama kategori"), {
      target: { value: "Produk UMKM" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Simpan kategori" }));

    await waitFor(() => {
      expect(createCategory).toHaveBeenCalledWith({ name: "Produk UMKM" });
    });
  });
});
