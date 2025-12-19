/** @format */

import { RepaymentBreadcrumb } from "./components/repayment-breadcrumb";
import { RepaymentHeader } from "./components/repayment-header";
import { RepaymentSummaryCard } from "./components/repayment-summary-card";
import { RepaymentSidebar } from "./components/repayment-sidebar";
import { REPAYMENT_BREADCRUMB } from "./constants";
import { PaymentMethods } from "../payment/components/payment-methods";
import { REPAYMENT_METHOD_GROUPS } from "./constants";
import { PaymentShell } from "../payment/shared/payment-shell";

export function AssetRepaymentPage() {
  return (
    <PaymentShell
      mode="settlement"
      breadcrumb={<RepaymentBreadcrumb />}
      header={<RepaymentHeader backHref={REPAYMENT_BREADCRUMB.backHref} />}
      summary={<RepaymentSummaryCard />}
      methods={<PaymentMethods mode="settlement" methodGroups={REPAYMENT_METHOD_GROUPS as any} />}
      sidebar={<RepaymentSidebar />}
    />
  );
}
