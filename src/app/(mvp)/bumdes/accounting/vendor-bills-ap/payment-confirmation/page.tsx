/** @format */

import type { Metadata } from "next";

import { VendorBillsApPaymentConfirmationPage } from "@/modules/accounting";

type AccountingVendorBillsPaymentConfirmationPageProps = {
  searchParams: Promise<{
    batch?: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Vendor Bills Ap - Payment Confirmation - Koperasi Digital",
  description: "Bumdes - Accounting - Vendor Bills Ap - Payment Confirmation page.",
};

export default async function AccountingVendorBillsPaymentConfirmationPage({
  searchParams,
}: AccountingVendorBillsPaymentConfirmationPageProps) {
  const { batch } = await searchParams;

  return <VendorBillsApPaymentConfirmationPage batchReference={batch} />;
}
