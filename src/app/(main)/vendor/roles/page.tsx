/** @format */

import { listRolesAction } from "@/actions/role";
import { RolesManager } from "@/components/feature/vendor/roles/roles-manager";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const roles = await listRolesAction();
  return <RolesManager initialData={roles ?? []} />;
}

