/** @format */

import { DUMMY_INVOICE_DETAIL } from "../../constants/dummy-data";
import { FeatureInvoiceDetailView } from "../features/FeatureInvoiceDetailView";

type InvoicingArInvoiceDetailPageProps = {
  invoiceNumber?: string;
};

export function InvoicingArInvoiceDetailPage({
  invoiceNumber,
}: InvoicingArInvoiceDetailPageProps) {
  const detail = invoiceNumber
    ? { ...DUMMY_INVOICE_DETAIL, invoice_number: invoiceNumber }
    : DUMMY_INVOICE_DETAIL;

  return <FeatureInvoiceDetailView detail={detail} />;
}
