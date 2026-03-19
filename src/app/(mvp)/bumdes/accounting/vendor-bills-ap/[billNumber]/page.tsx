/** @format */

import type { Metadata } from "next";

import { VendorBillsApDetailPage } from "@/modules/accounting";

type AccountingVendorBillDetailPageProps = {
  params: Promise<{
    billNumber: string;
  }>;
};

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Vendor Bills Ap - Detail - Koperasi Digital",
  description: "Bumdes - Accounting - Vendor Bills Ap - Detail page.",
};

export default async function AccountingVendorBillDetailPage({
  params,
}: AccountingVendorBillDetailPageProps) {
  const { billNumber } = await params;

  return <VendorBillsApDetailPage billNumber={billNumber} />;
}
