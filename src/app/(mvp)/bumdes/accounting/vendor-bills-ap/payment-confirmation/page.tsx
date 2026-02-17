/** @format */

import { VendorBillsApPaymentConfirmationPage } from "@/modules/accounting";

type AccountingVendorBillsPaymentConfirmationPageProps = {
  searchParams: Promise<{
    batch?: string;
  }>;
};

export default async function AccountingVendorBillsPaymentConfirmationPage({
  searchParams,
}: AccountingVendorBillsPaymentConfirmationPageProps) {
  const { batch } = await searchParams;

  return <VendorBillsApPaymentConfirmationPage batchReference={batch} />;
}
