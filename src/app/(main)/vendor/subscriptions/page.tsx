/** @format */

import { getVendorSubscriptionsSummary } from "@/services/api";
import { SubscriptionsSummary } from "@/components/feature/vendor/subscriptions/subscriptions-summary";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const res = await getVendorSubscriptionsSummary().catch(() => null);
  const initial = res?.data ?? undefined;
  return <SubscriptionsSummary initialData={initial} />;
}

