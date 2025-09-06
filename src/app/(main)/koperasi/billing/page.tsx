/** @format */

import { listClientInvoices } from "@/services/api";
import BillingClient from "./billingClient";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const res = await listClientInvoices({ limit: 100 }).catch(() => null);
  const invoices = res && res.success ? (res.data as any[]) : [];
  return (
    <div className="space-y-6">
      <BillingClient initialInvoices={invoices} />
    </div>
  );
}
