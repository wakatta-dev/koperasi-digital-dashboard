/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  TaxEfakturExportPage,
  TaxExportHistoryPage,
  TaxPpnDetailsPage,
  TaxSummaryPeriodPage,
} from "@/modules/accounting";
import { AccountingTaxApiError } from "@/services/api/accounting-tax";

const testState = vi.hoisted(() => ({
  pushMock: vi.fn(),
  replaceMock: vi.fn(),
  pathname: "/bumdes/accounting/tax",
  searchParams: new URLSearchParams(""),
  toastError: vi.fn(),
  toastSuccess: vi.fn(),
  generateTaxReportMutateAsync: vi.fn(),
  retryExportHistoryMutateAsync: vi.fn(),
  exportPphReportMutateAsync: vi.fn(),
  exportPpnRecapitulationMutateAsync: vi.fn(),
  exportEfakturMutateAsync: vi.fn(),
  overviewState: {
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
  },
  periodsState: {
    data: {
      items: [
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
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  },
  vatTransactionsState: {
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
  },
  pphRecordsState: {
    data: {
      summary_cards: [],
      items: [],
      pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  },
  exportHistoryState: {
    data: {
      items: [
        {
          export_id: "exp_003",
          date: "20 Nov 2023",
          time: "11:00 WIB",
          file_name: "ppn_summary_oct2023.xlsx",
          export_type: "PPNSummary",
          status: "Failed",
          can_retry: true,
          can_download: false,
        },
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  },
  efakturReadyState: {
    data: {
      items: [
        {
          invoice_id: "inv_1001",
          invoice_number: "INV/2023/1001",
          date: "Oct 24, 2023",
          counterparty: "PT. Maju Jaya",
          tax_base_amount: 100_000_000,
          vat_amount: 11_000_000,
          is_selected_default: true,
        },
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  },
  incomeTaxState: {
    data: {
      pph21_amount: 12_500_000,
      pph23_amount: 4_250_000,
      pph4_2_amount: 1_500_000,
      total_tax_payable: 18_250_000,
    },
    error: null,
    isPending: false,
  },
  complianceState: {
    data: {
      as_of: "2023-10-31T15:00:00Z",
      deadline: "Nov 15, 2023",
      steps: [
        { key: "efaktur_uploaded", label: "e-Faktur Uploaded", status: "Completed" },
      ],
    },
    error: null,
    isPending: false,
  },
}));

vi.mock("sonner", () => ({
  toast: {
    success: testState.toastSuccess,
    error: testState.toastError,
  },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: testState.pushMock,
    replace: testState.replaceMock,
  }),
  usePathname: () => testState.pathname,
  useSearchParams: () => testState.searchParams,
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingTaxOverview: () => testState.overviewState,
  useAccountingTaxPeriods: () => testState.periodsState,
  useAccountingTaxVatTransactions: () => testState.vatTransactionsState,
  useAccountingTaxPphRecords: () => testState.pphRecordsState,
  useAccountingTaxExportHistory: () => testState.exportHistoryState,
  useAccountingTaxEfakturReady: () => testState.efakturReadyState,
  useAccountingTaxIncomeTaxReport: () => testState.incomeTaxState,
  useAccountingTaxCompliance: () => testState.complianceState,
  useAccountingTaxMutations: () => ({
    generateTaxReport: { mutateAsync: testState.generateTaxReportMutateAsync },
    retryExportHistory: { mutateAsync: testState.retryExportHistoryMutateAsync },
    exportPphReport: { mutateAsync: testState.exportPphReportMutateAsync },
    exportPpnRecapitulation: { mutateAsync: testState.exportPpnRecapitulationMutateAsync },
    exportEfaktur: { mutateAsync: testState.exportEfakturMutateAsync },
  }),
}));

function resetStates() {
  testState.pathname = "/bumdes/accounting/tax";
  testState.searchParams = new URLSearchParams("");
  testState.toastError.mockReset();
  testState.toastSuccess.mockReset();
  testState.pushMock.mockReset();
  testState.replaceMock.mockReset();

  testState.generateTaxReportMutateAsync.mockReset();
  testState.retryExportHistoryMutateAsync.mockReset();
  testState.exportPphReportMutateAsync.mockReset();
  testState.exportPpnRecapitulationMutateAsync.mockReset();
  testState.exportEfakturMutateAsync.mockReset();

  testState.overviewState = {
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
  };
  testState.periodsState = {
    data: {
      items: [
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
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  };
  testState.vatTransactionsState = {
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
  };
  testState.exportHistoryState = {
    data: {
      items: [
        {
          export_id: "exp_003",
          date: "20 Nov 2023",
          time: "11:00 WIB",
          file_name: "ppn_summary_oct2023.xlsx",
          export_type: "PPNSummary",
          status: "Failed",
          can_retry: true,
          can_download: false,
        },
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  };
  testState.efakturReadyState = {
    data: {
      items: [
        {
          invoice_id: "inv_1001",
          invoice_number: "INV/2023/1001",
          date: "Oct 24, 2023",
          counterparty: "PT. Maju Jaya",
          tax_base_amount: 100_000_000,
          vat_amount: 11_000_000,
          is_selected_default: true,
        },
      ],
      pagination: { page: 1, per_page: 5, total_items: 1, total_pages: 1 },
    },
    error: null,
    isPending: false,
  };
  testState.incomeTaxState = {
    data: {
      pph21_amount: 12_500_000,
      pph23_amount: 4_250_000,
      pph4_2_amount: 1_500_000,
      total_tax_payable: 18_250_000,
    },
    error: null,
    isPending: false,
  };
  testState.complianceState = {
    data: {
      as_of: "2023-10-31T15:00:00Z",
      deadline: "Nov 15, 2023",
      steps: [{ key: "efaktur_uploaded", label: "e-Faktur Uploaded", status: "Completed" }],
    },
    error: null,
    isPending: false,
  };
}

describe("tax integration loading empty and errors", () => {
  beforeEach(() => {
    resetStates();
  });

  it("shows loading and empty states on summary page", () => {
    testState.periodsState = {
      data: null,
      error: null,
      isPending: true,
    };

    render(<TaxSummaryPeriodPage />);

    expect(screen.getByText("Loading tax period summary...")).toBeTruthy();

    testState.periodsState = {
      data: {
        items: [],
        pagination: { page: 1, per_page: 5, total_items: 0, total_pages: 0 },
      },
      error: null,
      isPending: false,
    };

    render(<TaxSummaryPeriodPage />);

    expect(screen.getAllByText("No tax summary period found.")[0]).toBeTruthy();
  });

  it("maps 409 errors when retrying export history", async () => {
    testState.pathname = "/bumdes/accounting/tax/export-history";
    testState.retryExportHistoryMutateAsync.mockRejectedValueOnce(
      new AccountingTaxApiError({
        message: "duplicate retry request",
        statusCode: 409,
      }),
    );

    render(<TaxExportHistoryPage />);

    fireEvent.click(screen.getByRole("button", { name: "Retry" }));

    await waitFor(() => {
      expect(testState.toastError).toHaveBeenCalledWith("duplicate retry request");
    });
  });

  it("maps 412 errors when exporting PPN recapitulation", async () => {
    testState.pathname = "/bumdes/accounting/tax/ppn-details";
    testState.searchParams = new URLSearchParams("period=2023-11");
    testState.exportPpnRecapitulationMutateAsync.mockRejectedValueOnce(
      new AccountingTaxApiError({
        message: "precondition failed for recap export",
        statusCode: 412,
      }),
    );

    render(<TaxPpnDetailsPage period="2023-11" />);

    fireEvent.click(screen.getByRole("button", { name: "Download Tax Recapitulation" }));

    await waitFor(() => {
      expect(testState.toastError).toHaveBeenCalledWith("precondition failed for recap export");
    });
  });

  it("maps 422 errors when exporting e-Faktur batch", async () => {
    testState.pathname = "/bumdes/accounting/tax/e-faktur-export";
    testState.exportEfakturMutateAsync.mockRejectedValueOnce(
      new AccountingTaxApiError({
        message: "invoice_ids cannot be empty",
        statusCode: 422,
      }),
    );

    render(<TaxEfakturExportPage />);

    fireEvent.click(screen.getByRole("button", { name: "Download CSV for e-Faktur" }));

    await waitFor(() => {
      expect(testState.toastError).toHaveBeenCalledWith("invoice_ids cannot be empty");
    });
  });

  it("maps 429 errors when generating tax report", async () => {
    testState.generateTaxReportMutateAsync.mockRejectedValueOnce(
      new AccountingTaxApiError({
        message: "rate limit exceeded",
        statusCode: 429,
      }),
    );

    render(<TaxSummaryPeriodPage />);

    fireEvent.click(screen.getByRole("button", { name: "Generate Tax Report" }));

    await waitFor(() => {
      expect(testState.toastError).toHaveBeenCalledWith("rate limit exceeded");
    });
  });
});
