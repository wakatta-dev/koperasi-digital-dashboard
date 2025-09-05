/** @format */

import { listUsersAction } from "@/actions/users";
import { VendorUsersList } from "@/components/feature/vendor/users/users-list";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure users CRUD endpoints are connected
export default async function UsersPage() {
  const users = await listUsersAction({ limit: 20 });
  return <VendorUsersList initialData={users ?? []} limit={20} />;
}

