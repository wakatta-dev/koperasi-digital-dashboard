/** @format */

import { INVOICING_AR_ROUTES } from "../../constants/routes";
import { FeatureCreditNotesTable } from "../features/FeatureCreditNotesTable";
import { FeaturePaymentsTable } from "../features/FeaturePaymentsTable";

export function InvoicingArCreditNotesPaymentsPage() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Credit Notes &amp; Payments</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage customer refunds, credit balances, and incoming payments.
        </p>
      </section>

      <FeatureCreditNotesTable createHref={INVOICING_AR_ROUTES.createCreditNote} />
      <FeaturePaymentsTable createHref={INVOICING_AR_ROUTES.createPayment} />
    </div>
  );
}
