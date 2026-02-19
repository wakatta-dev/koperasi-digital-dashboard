/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

vi.mock("@/hooks/queries", () => ({
  useAccountingTaxOverview: () => ({
    data: {
      cards: [],
      active_period: { year: 2023, month: 11, label: "November 2023" },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxPeriods: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxVatTransactions: () => ({
    data: {
      items: [
        {
          date: "Nov 25, 2023",
          invoice_number: "INV/2023/11/001",
          counterparty_name: "PT Sinar Jaya Abadi",
          counterparty_npwp: "01.234.567.8-012.000",
          transaction_type: "Sales",
          tax_base_amount: 100_000_000,
          vat_amount: 11_000_000,
        },
      ],
      totals: { vat_amount_total: 11_000_000 },
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxPphRecords: () => ({
    data: {
      summary_cards: [],
      items: [],
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxExportHistory: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxEfakturReady: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxIncomeTaxReport: () => ({
    data: {
      pph21_amount: 0,
      pph23_amount: 0,
      pph4_2_amount: 0,
      total_tax_payable: 0,
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxCompliance: () => ({
    data: {
      as_of: "2023-11-01T00:00:00Z",
      deadline: "Nov 15, 2023",
      steps: [],
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxMutations: () => ({
    generateTaxReport: { mutateAsync: vi.fn() },
    retryExportHistory: { mutateAsync: vi.fn() },
    exportPphReport: { mutateAsync: vi.fn() },
    exportPpnRecapitulation: { mutateAsync: vi.fn() },
    exportEfaktur: { mutateAsync: vi.fn().mockResolvedValue({}) },
  }),
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

  it("closes loop from e-Faktur Export back to Summary & Period when CSV export is triggered", async () => {
    state.pathname = "/bumdes/accounting/tax/e-faktur-export";

    render(<TaxEfakturExportPage />);

    fireEvent.click(screen.getByRole("button", { name: "Download CSV for e-Faktur" }));

    await waitFor(() => {
      expect(state.pushMock).toHaveBeenCalledWith(ACCOUNTING_TAX_ROUTES.summary);
    });
  });
});
