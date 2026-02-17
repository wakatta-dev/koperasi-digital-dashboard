/** @format */

"use client";

import { useRouter } from "next/navigation";

import { VENDOR_BILLS_AP_ROUTES } from "../../constants/vendor-bills-ap-routes";
import { FeaturePaymentSchedulingSuccessCard } from "../features/FeaturePaymentSchedulingSuccessCard";

export function VendorBillsApPaymentConfirmationPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <FeaturePaymentSchedulingSuccessCard
        onDone={() => router.push(VENDOR_BILLS_AP_ROUTES.index)}
      />
    </div>
  );
}
