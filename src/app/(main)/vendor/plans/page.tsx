/** @format */

import { listVendorPlansPage } from "@/actions/billing";
import { VendorPlansList } from "@/components/feature/vendor/plans/plans-list";
import type { Plan } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure billing endpoints are connected in actions/hooks
export default async function PlansPage() {
  const { data } = await listVendorPlansPage({ limit: 20 });
  return <VendorPlansList initialData={(data ?? []) as Plan[]} limit={20} />;
}
