/** @format */

import { listNotificationsAction } from "@/actions/notifications";
import { VendorNotificationsList } from "@/components/feature/vendor/notifications/notifications-list";
import { NotificationsActionsBar } from "@/components/feature/vendor/notifications/notifications-actions-bar";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure notifications endpoints wired for list/create/update
export default async function NotificationsPage() {
  const res = await listNotificationsAction({ limit: 10 });
  return (
    <div className="space-y-6">
      <NotificationsActionsBar />
      <VendorNotificationsList initialData={res ?? []} limit={10} />
    </div>
  );
}
