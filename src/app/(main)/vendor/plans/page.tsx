/** @format */

import { listVendorPlansAction } from "@/actions/billing";
import { VendorPlansList } from "@/components/feature/vendor/plans/plans-list";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure billing endpoints are connected in actions/hooks
export default async function PlansPage() {
  const plans = await listVendorPlansAction({ limit: 20 });
  return <VendorPlansList initialData={plans ?? []} limit={20} />;
}

