/** @format */

import { listVendorUsersPage } from "@/actions/users";
import { VendorUsersList } from "@/components/feature/vendor/users/users-list";
import type { User } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure users CRUD endpoints are connected
export default async function UsersPage() {
  const { data } = await listVendorUsersPage({ limit: 20 });
  return <VendorUsersList initialData={(data ?? []) as User[]} limit={20} />;
}
