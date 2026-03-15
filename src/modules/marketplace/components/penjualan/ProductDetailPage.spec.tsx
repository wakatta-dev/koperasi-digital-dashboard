/** @format */

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { ProductDetailPage } from "./ProductDetailPage";

const mockUseInventoryProduct = vi.fn();
const mockUseInventoryProductStats = vi.fn();
const mockUseInventoryVariants = vi.fn();
const mockUseInventoryStockHistory = vi.fn();
const mockUseInventoryActions = vi.fn();
const mockUseInventoryVariantActions = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@/hooks/queries/inventory", () => ({
  useInventoryProduct: (...args: unknown[]) => mockUseInventoryProduct(...args),
  useInventoryProductStats: (...args: unknown[]) => mockUseInventoryProductStats(...args),
  useInventoryVariants: (...args: unknown[]) => mockUseInventoryVariants(...args),
  useInventoryStockHistory: (...args: unknown[]) => mockUseInventoryStockHistory(...args),
  useInventoryActions: () => mockUseInventoryActions(),
  useInventoryVariantActions: () => mockUseInventoryVariantActions(),
}));

vi.mock("./ProductDetailHeader", () => ({ ProductDetailHeader: () => <div>header</div> }));
vi.mock("./ProductMediaCard", () => ({ ProductMediaCard: () => <div>media</div> }));
vi.mock("./ProductBasicInfoCard", () => ({ ProductBasicInfoCard: () => <div>basic-info</div> }));
vi.mock("./ProductStatsCards", () => ({ ProductStatsCards: () => <div>stats</div> }));
vi.mock("./ProductVariantsTable", () => ({ ProductVariantsTable: () => <div>variants</div> }));
vi.mock("./ProductInventoryHistory", () => ({ ProductInventoryHistory: () => <div>history</div> }));
vi.mock("./ProductDeleteModal", () => ({ ProductDeleteModal: () => null }));
vi.mock("./ProductInventoryHistoryModal", () => ({ ProductInventoryHistoryModal: () => null }));
vi.mock("@/services/api/marketplace", () => ({
  getMarketplaceListingSubmission: vi.fn(async () => ({
    success: true,
    data: {
      id: 1,
      seller_id: 9,
      listing_id: 901,
      proposed_inventory_product_id: 77,
      state: "approved",
      review_notes: "siap tayang",
    },
  })),
  getMarketplaceListingChannels: vi.fn(async () => ({
    success: true,
    data: [
      { id: 1, channel: "marketplace", publishability_state: "approved" },
      { id: 2, channel: "pos", publishability_state: "blocked", blocker_code: "not_pos_enabled" },
    ],
  })),
  createMarketplaceListingSubmission: vi.fn(),
  reviewMarketplaceListingSubmission: vi.fn(),
  updateMarketplaceListingChannel: vi.fn(),
}));

function renderWithQuery(ui: React.ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

describe("ProductDetailPage", () => {
  it("shows submission and channel publishability details when listing context exists", async () => {
    mockUseInventoryProduct.mockReturnValue({
      data: {
        id: 77,
        listing_id: 901,
        name: "Kopi Listing",
        sku: "KOPI-LIST",
        price_sell: 15000,
        track_stock: true,
        stock: 7,
        status: "ACTIVE",
        description: "Kopi siap jual",
        category: "Pangan",
        show_in_marketplace: true,
        seller_id: 9,
        ownership_mode: "merchant_payout",
        publishability_state: "approved",
        source_stock_type: "inventory_product",
        source_stock_reference: "77",
        images: [{ id: 1, url: "https://cdn.example.com/kopi.jpg", is_primary: true, sort_order: 0 }],
      },
      isLoading: false,
      isError: false,
    });
    mockUseInventoryProductStats.mockReturnValue({ data: null });
    mockUseInventoryVariants.mockReturnValue({ data: { options: [], variant_groups: [] } });
    mockUseInventoryStockHistory.mockReturnValue({ data: [] });
    mockUseInventoryActions.mockReturnValue({ update: { mutate: vi.fn(), isPending: false } });
    mockUseInventoryVariantActions.mockReturnValue({
      uploadOptionImage: { mutateAsync: vi.fn() },
      deleteOptionImage: { mutateAsync: vi.fn() },
    });

    renderWithQuery(<ProductDetailPage id="77" />);

    expect(await screen.findByText("Listing ID:")).toBeTruthy();
    expect(screen.getByText("#901")).toBeTruthy();
    expect(screen.getByText("Submission review:")).toBeTruthy();
    expect(screen.getByText("Publishability per Channel")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ajukan Review" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Approve" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hold for Revision" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Reject" })).toBeTruthy();
  });
});
