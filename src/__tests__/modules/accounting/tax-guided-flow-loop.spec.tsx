/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  ACCOUNTING_TAX_ROUTES,
  TaxEfakturExportPage,
  TaxExportHistoryPage,
  TaxPphRecordsPage,
  TaxPpnDetailsPage,
} from "@/modules/accounting";

const state = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
  pathname: "/bumdes/accounting/tax/ppn-details",
  searchParams: new URLSearchParams("period=2023-11"),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: state.pushMock,
    replace: state.replaceMock,
  }),
  usePathname: () => state.pathname,
  useSearchParams: () => state.searchParams,
}));

describe("tax guided continuation flow", () => {
  beforeEach(() => {
    state.pushMock.mockReset();
    state.replaceMock.mockReset();
    state.pathname = "/bumdes/accounting/tax/ppn-details";
    state.searchParams = new URLSearchParams("period=2023-11");
  });

  it("continues from PPN Details to PPh Records via tab navigation", () => {
    render(<TaxPpnDetailsPage period="2023-11" />);

    fireEvent.click(screen.getByRole("tab", { name: "PPh Records" }));

    expect(state.pushMock).toHaveBeenCalledWith(ACCOUNTING_TAX_ROUTES.pphRecords);
  });

  it("continues from PPh Records to Export History via tab navigation", () => {
    state.pathname = "/bumdes/accounting/tax/pph-records";

    render(<TaxPphRecordsPage />);

    fireEvent.click(screen.getByRole("tab", { name: "Export History" }));

    expect(state.pushMock).toHaveBeenCalledWith(ACCOUNTING_TAX_ROUTES.exportHistory);
  });

  it("continues from Export History to e-Faktur Export via tab navigation", () => {
    state.pathname = "/bumdes/accounting/tax/export-history";

    render(<TaxExportHistoryPage />);

    fireEvent.click(screen.getByRole("tab", { name: "e-Faktur Export" }));

    expect(state.pushMock).toHaveBeenCalledWith(ACCOUNTING_TAX_ROUTES.efakturExport);
  });

  it("closes loop from e-Faktur Export back to Summary & Period when CSV export is triggered", () => {
    state.pathname = "/bumdes/accounting/tax/e-faktur-export";

    render(<TaxEfakturExportPage />);

    fireEvent.click(screen.getByRole("button", { name: "Download CSV for e-Faktur" }));

    expect(state.pushMock).toHaveBeenCalledWith(ACCOUNTING_TAX_ROUTES.summary);
  });
});
