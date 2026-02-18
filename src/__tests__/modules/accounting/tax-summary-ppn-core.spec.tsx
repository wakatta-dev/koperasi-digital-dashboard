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

const summaryRowsFixture = [
  {
    period_label: "November 2023",
    period_code: "2023-11",
    ppn_keluaran: 485_250_000,
    ppn_masukan: 312_500_000,
    net_amount: 172_750_000,
    net_position: "KB",
    total_pph: 45_800_000,
    status: "Open",
  },
  {
    period_label: "October 2023",
    period_code: "2023-10",
    ppn_keluaran: 430_100_000,
    ppn_masukan: 301_000_000,
    net_amount: 129_100_000,
    net_position: "KB",
    total_pph: 40_300_000,
    status: "Reported",
  },
];

const vatRowsFixture = [
  {
    date: "Nov 25, 2023",
    invoice_number: "INV/2023/11/001",
    counterparty_name: "PT Sinar Jaya Abadi",
    counterparty_npwp: "01.234.567.8-012.000",
    transaction_type: "Sales",
    tax_base_amount: 100_000_000,
    vat_amount: 11_000_000,
  },
  {
    date: "Nov 24, 2023",
    invoice_number: "INV/2023/11/002",
    counterparty_name: "CV Maju Bersama",
    counterparty_npwp: "22.111.987.6-123.000",
    transaction_type: "Purchase",
    tax_base_amount: 65_000_000,
    vat_amount: 7_150_000,
  },
];

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
      cards: [
        {
          key: "total_ppn_keluaran",
          label: "Total PPN Keluaran",
          value: "Rp 485.250.000",
          helper_text: "Output VAT (Collected)",
          tone: "warning",
        },
      ],
      active_period: { year: 2023, month: 11, label: "November 2023" },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxPeriods: (params?: {
    q?: string;
    year?: string;
    status?: "Open" | "Reported" | "Compensated";
    page?: number;
    per_page?: number;
  }) => {
    const needle = params?.q?.toLowerCase() ?? "";
    const filtered = summaryRowsFixture.filter((row) => {
      const searchPass =
        needle.length === 0 ||
        row.period_label.toLowerCase().includes(needle) ||
        row.period_code.toLowerCase().includes(needle);
      const yearPass = !params?.year || row.period_code.startsWith(params.year);
      const statusPass = !params?.status || row.status === params.status;
      return searchPass && yearPass && statusPass;
    });

    return {
      data: {
        items: filtered,
        pagination: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 5,
          total_items: filtered.length,
          total_pages: 1,
        },
      },
      error: null,
      isPending: false,
    };
  },
  useAccountingTaxVatTransactions: (params?: {
    period?: string;
    transaction_type?: "Sales" | "Purchase";
    q?: string;
    page?: number;
    per_page?: number;
  }) => {
    const needle = params?.q?.toLowerCase() ?? "";
    const filtered = vatRowsFixture.filter((row) => {
      const searchPass =
        needle.length === 0 ||
        row.invoice_number.toLowerCase().includes(needle) ||
        row.counterparty_name.toLowerCase().includes(needle);
      const typePass = !params?.transaction_type || row.transaction_type === params.transaction_type;
      return searchPass && typePass;
    });

    return {
      data: {
        items: filtered,
        totals: {
          vat_amount_total: filtered.reduce((total, row) => total + row.vat_amount, 0),
        },
        pagination: {
          page: params?.page ?? 1,
          per_page: params?.per_page ?? 5,
          total_items: filtered.length,
          total_pages: 1,
        },
      },
      error: null,
      isPending: false,
    };
  },
  useAccountingTaxMutations: () => ({
    generateTaxReport: { mutateAsync: vi.fn() },
    retryExportHistory: { mutateAsync: vi.fn() },
    exportPphReport: { mutateAsync: vi.fn() },
    exportPpnRecapitulation: { mutateAsync: vi.fn() },
    exportEfaktur: { mutateAsync: vi.fn() },
  }),
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
