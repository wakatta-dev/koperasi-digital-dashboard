/** @format */

import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";
import {
  TaxEfakturExportPage,
  TaxExportHistoryPage,
  TaxPphRecordsPage,
  TaxPpnDetailsPage,
  TaxSummaryPeriodPage,
} from "@/modules/accounting";

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
  useAccountingTaxPeriods: () => ({
    data: {
      items: summaryRowsFixture,
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingTaxVatTransactions: () => ({
    data: {
      items: vatRowsFixture,
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
    exportEfaktur: { mutateAsync: vi.fn() },
  }),
}));

describe("tax foundation", () => {
  beforeEach(() => {
    state.pushMock.mockReset();
    state.replaceMock.mockReset();
    state.pathname = "/bumdes/accounting/tax";
    state.searchParams = new URLSearchParams("");
  });

  it("renders all tax route page containers", () => {
    const summary = render(<TaxSummaryPeriodPage />);
    expect(screen.getByRole("heading", { name: "Tax Management (PPN & PPh)" })).toBeTruthy();
    summary.unmount();

    const ppn = render(<TaxPpnDetailsPage />);
    expect(screen.getByRole("heading", { name: "Detail Transaksi PPN (VAT)" })).toBeTruthy();
    ppn.unmount();

    const pph = render(<TaxPphRecordsPage />);
    expect(screen.getByRole("heading", { name: "Daftar Rekaman PPh (Income Tax)" })).toBeTruthy();
    pph.unmount();

    const history = render(<TaxExportHistoryPage />);
    expect(screen.getByRole("heading", { name: "Tax Management (PPN & PPh)" })).toBeTruthy();
    history.unmount();

    render(<TaxEfakturExportPage />);
    expect(screen.getByRole("heading", { name: "e-Faktur Export & Tax Reports" })).toBeTruthy();
  });

  it("registers tax submenu entries under accounting", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const taxItem = accountingItem?.items?.find((item) => item.name === "Tax");
    expect(taxItem).toBeTruthy();
    expect(taxItem?.items).toEqual([
      { name: "Summary & Period", href: "/bumdes/accounting/tax" },
      { name: "PPN Details", href: "/bumdes/accounting/tax/ppn-details" },
      { name: "PPh Records", href: "/bumdes/accounting/tax/pph-records" },
      { name: "Export History", href: "/bumdes/accounting/tax/export-history" },
      { name: "e-Faktur Export", href: "/bumdes/accounting/tax/e-faktur-export" },
    ]);
  });

  it("registers title map entries for tax child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/tax"]).toBe("Accounting - Tax");
    expect(bumdesTitleMap["/bumdes/accounting/tax/ppn-details"]).toBe(
      "Accounting - Tax - PPN Details"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/pph-records"]).toBe(
      "Accounting - Tax - PPh Records"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/export-history"]).toBe(
      "Accounting - Tax - Export History"
    );
    expect(bumdesTitleMap["/bumdes/accounting/tax/e-faktur-export"]).toBe(
      "Accounting - Tax - e-Faktur Export"
    );
  });
});
