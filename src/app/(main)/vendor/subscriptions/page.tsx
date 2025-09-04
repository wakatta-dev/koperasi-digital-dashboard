/** @format */

import { getVendorSubscriptionsSummary, listVendorSubscriptions } from "@/services/api";
import { SubscriptionsSummary } from "@/components/feature/vendor/subscriptions/subscriptions-summary";
import { VendorSubscriptionsList } from "@/components/feature/vendor/subscriptions/subscriptions-list";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const res = await getVendorSubscriptionsSummary().catch(() => null);
  const initial = res?.data ?? undefined;
  const listRes = await listVendorSubscriptions({ limit: 20 }).catch(() => null);
  const initialSubs = listRes?.data ?? undefined;
  const initialCursor = (listRes?.meta?.pagination as any)?.next_cursor as string | undefined;
  return (
    <div className="space-y-6">
      <SubscriptionsSummary initialData={initial} />
      <VendorSubscriptionsList initialData={initialSubs} initialCursor={initialCursor} limit={20} />
    </div>
  );
}
