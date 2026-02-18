/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { TaxPpnDetailsPage, TaxSummaryPeriodPage } from "@/modules/accounting";

const state = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
  pathname: "/bumdes/accounting/tax",
  searchParams: new URLSearchParams(""),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: state.pushMock,
    replace: state.replaceMock,
  }),
  usePathname: () => state.pathname,
  useSearchParams: () => state.searchParams,
}));

describe("tax summary and ppn core", () => {
  beforeEach(() => {
    state.pushMock.mockReset();
    state.replaceMock.mockReset();
    state.pathname = "/bumdes/accounting/tax";
    state.searchParams = new URLSearchParams("");
  });

  it("renders summary cards and routes details action to ppn page with period context", () => {
    render(<TaxSummaryPeriodPage />);

    expect(screen.getByRole("heading", { name: "Tax Management (PPN & PPh)" })).toBeTruthy();
    expect(screen.getByText("Total PPN Keluaran")).toBeTruthy();

    fireEvent.click(screen.getAllByRole("button", { name: "Details" })[0]);

    expect(state.pushMock).toHaveBeenCalledTimes(1);
    expect(state.pushMock.mock.calls[0][0]).toContain("/bumdes/accounting/tax/ppn-details?period=2023-11");
    expect(state.pushMock.mock.calls[0][0]).toContain("&from=");
  });

  it("filters summary table using tax period search", () => {
    render(<TaxSummaryPeriodPage />);

    const searchInput = screen.getByPlaceholderText("Search tax period...");
    fireEvent.change(searchInput, { target: { value: "October" } });

    expect(screen.getByText("October 2023")).toBeTruthy();
    expect(screen.queryByText("November 2023")).toBeNull();
  });

  it("renders ppn details page and restores summary query when back action is used", () => {
    state.pathname = "/bumdes/accounting/tax/ppn-details";
    state.searchParams = new URLSearchParams("period=2023-11&from=q%3DOctober%26page%3D2");

    render(<TaxPpnDetailsPage period="2023-11" returnToQuery="q%3DOctober%26page%3D2" />);

    expect(screen.getByRole("heading", { name: "Detail Transaksi PPN (VAT)" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Back to Summary" }));

    expect(state.pushMock).toHaveBeenCalledWith("/bumdes/accounting/tax?q=October&page=2");
  });

  it("filters ppn detail table via search input", () => {
    state.pathname = "/bumdes/accounting/tax/ppn-details";
    state.searchParams = new URLSearchParams("period=2023-11");

    render(<TaxPpnDetailsPage period="2023-11" />);

    expect(screen.getByText("PT Sinar Jaya Abadi")).toBeTruthy();

    fireEvent.change(screen.getByPlaceholderText("Search invoice or customer..."), {
      target: { value: "Not Found Company" },
    });

    expect(screen.getByText("No VAT transaction found.")).toBeTruthy();
  });
});
