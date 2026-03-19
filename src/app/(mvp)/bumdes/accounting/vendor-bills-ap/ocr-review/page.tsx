/** @format */

import type { Metadata } from "next";

import { VendorBillsApOcrReviewPage } from "@/modules/accounting";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Vendor Bills Ap - Ocr Review - Koperasi Digital",
  description: "Bumdes - Accounting - Vendor Bills Ap - Ocr Review page.",
};

export default function AccountingVendorBillsOcrReviewPage() {
  return <VendorBillsApOcrReviewPage />;
}
