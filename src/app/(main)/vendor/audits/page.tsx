/** @format */

import { listVendorAudits } from "@/services/api";
import { VendorAuditsList } from "@/components/feature/vendor/audits/audits-list";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const res = await listVendorAudits({ limit: 50 }).catch(() => null);
  const initial = res?.data ?? undefined;
  const initialCursor = (res?.meta?.pagination as any)?.next_cursor as string | undefined;
  return <VendorAuditsList initialData={initial} initialCursor={initialCursor} limit={50} />;
}
