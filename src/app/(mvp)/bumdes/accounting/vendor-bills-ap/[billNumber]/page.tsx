/** @format */

import { VendorBillsApDetailPage } from "@/modules/accounting";

type AccountingVendorBillDetailPageProps = {
  params: Promise<{
    billNumber: string;
  }>;
};

export default async function AccountingVendorBillDetailPage({
  params,
}: AccountingVendorBillDetailPageProps) {
  const { billNumber } = await params;

  return <VendorBillsApDetailPage billNumber={billNumber} />;
}
