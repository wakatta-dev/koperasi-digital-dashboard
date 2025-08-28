/** @format */

import { listVendorPlansAction } from "@/actions/billing";
import { VendorPlansList } from "@/components/feature/vendor/plans/plans-list";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await listVendorPlansAction({ limit: 20 });
  return <VendorPlansList initialData={plans ?? []} limit={20} />;
}
