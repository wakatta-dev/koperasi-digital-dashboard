/** @format */

import { listVendorAudits } from "@/services/api";
import { VendorAuditsList } from "@/components/feature/vendor/audits/audits-list";

export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const res = await listVendorAudits({ limit: 50 }).catch(() => null);
  const initial = res?.data ?? undefined;
  return <VendorAuditsList initialData={initial} limit={50} />;
}

