/** @format */

import { PaymentBreadcrumb } from "./components/payment-breadcrumb";
import { PaymentHeader } from "./components/payment-header";
import { RentalSummaryCard } from "./components/rental-summary-card";
import { PaymentMethods } from "./components/payment-methods";
import { PaymentSidebar } from "./components/payment-sidebar";
import { PAYMENT_BREADCRUMB } from "./constants";
import { PaymentShell } from "./shared/payment-shell";

export function AssetPaymentPage() {
  return (
    <PaymentShell
      mode="dp"
      breadcrumb={<PaymentBreadcrumb />}
      header={<PaymentHeader backHref={PAYMENT_BREADCRUMB.backHref} />}
      summary={<RentalSummaryCard />}
      methods={<PaymentMethods mode="dp" />}
      sidebar={<PaymentSidebar />}
    />
  );
}
