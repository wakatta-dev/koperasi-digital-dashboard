/** @format */

import type { Metadata } from "next";

import { VendorBillsApBatchPaymentPage } from "@/modules/accounting";

type AccountingVendorBillsBatchPaymentPageProps = {
  searchParams: Promise<{
    bills?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Vendor Bills Ap - Batch Payment - Koperasi Digital",
  description: "Bumdes - Accounting - Vendor Bills Ap - Batch Payment page.",
};

export default async function AccountingVendorBillsBatchPaymentPage({
  searchParams,
}: AccountingVendorBillsBatchPaymentPageProps) {
  const { bills } = await searchParams;
  const preselectedBillNumbers = (bills ?? "")
    .split(",")
    .map((value) => decodeURIComponent(value).trim())
    .filter(Boolean);

  return <VendorBillsApBatchPaymentPage preselectedBillNumbers={preselectedBillNumbers} />;
}
