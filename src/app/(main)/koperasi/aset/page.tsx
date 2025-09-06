/** @format */

import { AssetsPanel } from "@/components/feature/koperasi/assets/assets-panel";
import { listAssets } from "@/services/api";

export const dynamic = "force-dynamic";

export default async function AsetPage() {
  const res = await listAssets().catch(() => null);
  const items = res && res.success ? (res.data as any[]) : [];
  return <AssetsPanel initial={items} />;
}
