/** @format */

import { VendorBillsApBatchPaymentPage } from "@/modules/accounting";

type AccountingVendorBillsBatchPaymentPageProps = {
  searchParams: Promise<{
    bills?: string;
  }>;
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
