/** @format */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import { PartnerManagementPage } from "./PartnerManagementPage";

const mockUsePartnerManagementSellers = vi.fn();

vi.mock("@/hooks/queries/partner-management", () => ({
  usePartnerManagementSellers: () => mockUsePartnerManagementSellers(),
}));

describe("PartnerManagementPage", () => {
  it("shows canonical seller rows", () => {
    mockUsePartnerManagementSellers.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        items: [
          {
            seller_id: "9",
            seller_name: "UMKM Gula Aren",
            business_name: "Gula Aren Desa",
            owner_name: "Bu Sari",
            business_type: "Pangan",
            lifecycle_state: "verified",
            ready_for_review: true,
            created_at: "2026-03-14T00:00:00Z",
            updated_at: "2026-03-14T00:00:00Z",
          },
        ],
      },
    });

    render(<PartnerManagementPage />);

    expect(screen.getByText("UMKM Gula Aren")).toBeTruthy();
    expect(screen.getByText("Seller #9")).toBeTruthy();
    expect(screen.getByText("verified")).toBeTruthy();
  });
});
