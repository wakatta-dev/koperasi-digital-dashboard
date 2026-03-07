/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { describe, expect, it, vi } from "vitest";
import { AssetMasterDataPage } from "./asset-master-data-page";

const mockUseAssetMasterData = vi.fn();

vi.mock("../hooks/use-asset-master-data", () => ({
  useAssetMasterData: () => mockUseAssetMasterData(),
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

describe("AssetMasterDataPage", () => {
  it("renders active and inactive master data with toggle actions", () => {
    mockUseAssetMasterData.mockReturnValue({
      data: {
        categories: [
          { id: 1, kind: "CATEGORY", value: "Aset Harian", sort_order: 1, is_active: true },
          { id: 2, kind: "CATEGORY", value: "Bangunan Lama", sort_order: 2, is_active: false },
        ],
        locations: [],
        statuses: [],
      },
      isLoading: false,
      isError: false,
      error: null,
    });

    renderWithClient(<AssetMasterDataPage />);

    expect(screen.getByText("Aktif")).toBeTruthy();
    expect(screen.getByText("Nonaktif")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nonaktifkan" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Aktifkan" })).toBeTruthy();
  });
});
