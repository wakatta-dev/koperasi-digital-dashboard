/** @format */

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import {
  VendorBillsApBatchPaymentPage,
  VendorBillsApDetailPage,
  VendorBillsApIndexPage,
  VendorBillsApOcrReviewPage,
  VendorBillsApPaymentConfirmationPage,
} from "@/modules/accounting";
import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/queries", () => ({
  useAccountingApOverview: () => ({
    data: { cards: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApBills: () => ({
    data: {
      items: [],
      pagination: { page: 1, per_page: 24, total_items: 0, total_pages: 0 },
    },
    error: null,
    isPending: false,
  }),
  useAccountingApBillMutations: () => ({
    createBill: { isPending: false, mutateAsync: vi.fn() },
    updateBill: { isPending: false, mutateAsync: vi.fn() },
    updateBillStatus: { isPending: false, mutateAsync: vi.fn() },
  }),
  useAccountingApBillDetail: () => ({
    data: null,
    error: null,
    isPending: false,
  }),
  useAccountingApBillPayments: () => ({
    data: { items: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApVendorCredits: () => ({
    data: { items: [] },
    error: null,
    isPending: false,
  }),
  useAccountingApBatchMutations: () => ({
    previewBatchPayment: { isPending: false, mutateAsync: vi.fn() },
    confirmBatchPayment: { isPending: false, mutateAsync: vi.fn() },
  }),
  useAccountingApOcrMutations: () => ({
    createOcrSession: { isPending: false, mutateAsync: vi.fn() },
    saveOcrProgress: { isPending: false, mutateAsync: vi.fn() },
    confirmOcrSession: { isPending: false, mutateAsync: vi.fn() },
  }),
  useAccountingApBatchDetail: () => ({
    data: null,
    error: null,
    isPending: false,
  }),
}));

describe("vendor-bills-ap foundation", () => {
  it("renders all AP route page containers", () => {
    const index = render(<VendorBillsApIndexPage />);
    expect(screen.getByRole("heading", { name: "Vendor Bills (AP)" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Batch Payment" }).getAttribute("href")).toBe(
      "/bumdes/accounting/vendor-bills-ap/batch-payment"
    );
    expect(screen.getByRole("link", { name: "OCR Upload" }).getAttribute("href")).toBe(
      "/bumdes/accounting/vendor-bills-ap/ocr-review"
    );
    index.unmount();

    const detail = render(<VendorBillsApDetailPage billNumber="BILL-2023-089" />);
    expect(screen.getByRole("heading", { name: "BILL-2023-089" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pay Now" })).toBeTruthy();
    detail.unmount();

    const batch = render(<VendorBillsApBatchPaymentPage />);
    expect(screen.getByRole("heading", { name: "Batch Payment Review" })).toBeTruthy();
    batch.unmount();

    const ocr = render(<VendorBillsApOcrReviewPage />);
    expect(screen.getByRole("heading", { name: "OCR Bill Review & Extraction" })).toBeTruthy();
    ocr.unmount();

    render(<VendorBillsApPaymentConfirmationPage />);
    expect(screen.getByRole("heading", { name: "Pembayaran Berhasil!" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Done" })).toBeTruthy();
  });

  it("keeps accounting AP menu as a single sidebar entry without AP submenu", () => {
    const accountingItem = bumdesNavigation.find((item) => item.name === "Accounting");
    expect(accountingItem).toBeTruthy();
    const vendorBillsItem = accountingItem?.items?.find(
      (item) => item.name === "Vendor Bills (AP)"
    );
    expect(vendorBillsItem).toBeTruthy();
    expect(vendorBillsItem?.items).toBeUndefined();
  });

  it("registers title map entries for AP child routes", () => {
    expect(bumdesTitleMap["/bumdes/accounting/vendor-bills-ap"]).toBe(
      "Accounting - Vendor Bills (AP)"
    );
    expect(bumdesTitleMap["/bumdes/accounting/vendor-bills-ap/[billNumber]"]).toBe(
      "Accounting - Vendor Bills (AP) - Bill Detail"
    );
    expect(bumdesTitleMap["/bumdes/accounting/vendor-bills-ap/batch-payment"]).toBe(
      "Accounting - Vendor Bills (AP) - Batch Payment"
    );
    expect(bumdesTitleMap["/bumdes/accounting/vendor-bills-ap/ocr-review"]).toBe(
      "Accounting - Vendor Bills (AP) - OCR Review"
    );
    expect(bumdesTitleMap["/bumdes/accounting/vendor-bills-ap/payment-confirmation"]).toBe(
      "Accounting - Vendor Bills (AP) - Payment Confirmation"
    );
  });
});
