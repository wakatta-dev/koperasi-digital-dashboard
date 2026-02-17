/** @format */

import { render, screen } from "@testing-library/react";

import {
  VendorBillsApBatchPaymentPage,
  VendorBillsApDetailPage,
  VendorBillsApIndexPage,
  VendorBillsApOcrReviewPage,
  VendorBillsApPaymentConfirmationPage,
} from "@/modules/accounting";
import { bumdesNavigation, bumdesTitleMap } from "@/app/(mvp)/bumdes/navigation";

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
    expect(screen.getByRole("link", { name: "Pay Now" }).getAttribute("href")).toBe(
      "/bumdes/accounting/vendor-bills-ap/batch-payment?bill=BILL-2023-089"
    );
    detail.unmount();

    const batch = render(<VendorBillsApBatchPaymentPage />);
    expect(screen.getByRole("heading", { name: "Batch Payment Review" })).toBeTruthy();
    batch.unmount();

    const ocr = render(<VendorBillsApOcrReviewPage />);
    expect(screen.getByRole("heading", { name: "OCR Bill Review & Extraction" })).toBeTruthy();
    ocr.unmount();

    render(<VendorBillsApPaymentConfirmationPage />);
    expect(screen.getByRole("heading", { name: "Pembayaran Berhasil!" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Done" }).getAttribute("href")).toBe(
      "/bumdes/accounting/vendor-bills-ap"
    );
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
