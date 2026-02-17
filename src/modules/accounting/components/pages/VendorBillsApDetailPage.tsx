/** @format */

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import {
  DUMMY_VENDOR_BILL_DETAIL,
  DUMMY_VENDOR_BILL_DETAILS_BY_NUMBER,
} from "../../constants/vendor-bills-ap-dummy";
import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import { FeatureVendorBillDetailOverview } from "../features/FeatureVendorBillDetailOverview";
import { FeatureVendorBillInternalNoteCard } from "../features/FeatureVendorBillInternalNoteCard";
import { FeatureVendorBillLineItemsTable } from "../features/FeatureVendorBillLineItemsTable";
import { FeatureVendorBillPaymentHistoryTable } from "../features/FeatureVendorBillPaymentHistoryTable";

type VendorBillsApDetailPageProps = {
  billNumber?: string;
};

export function VendorBillsApDetailPage({
  billNumber,
}: VendorBillsApDetailPageProps) {
  const router = useRouter();
  const normalizedBillNumber = (billNumber ?? "").trim();
  const detail = useMemo(
    () => DUMMY_VENDOR_BILL_DETAILS_BY_NUMBER[normalizedBillNumber] ?? DUMMY_VENDOR_BILL_DETAIL,
    [normalizedBillNumber]
  );

  return (
    <div className="space-y-6">
      <FeatureVendorBillDetailOverview
        detail={detail.overview}
        onPayNow={() =>
          router.push(
            `${VENDOR_BILLS_AP_ROUTES.batchPayment}?bills=${encodeURIComponent(detail.overview.bill_number)}`
          )
        }
      />
      <FeatureVendorBillLineItemsTable rows={detail.line_items} totals={detail.totals} />
      <FeatureVendorBillPaymentHistoryTable rows={detail.payment_history} />
      <FeatureVendorBillInternalNoteCard note={detail.internal_note} />
    </div>
  );
}
