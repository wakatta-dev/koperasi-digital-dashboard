/** @format */

import { VendorNotificationsList } from "@/components/feature/vendor/notifications/notifications-list";
import { NotificationsActionsBar } from "@/components/feature/vendor/notifications/notifications-actions-bar";
import { listVendorNotificationsPage } from "@/actions/notifications";
import type { Notification } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure notifications endpoints wired for list/create/update
export default async function NotificationsPage() {
  const { data } = await listVendorNotificationsPage({ limit: 10 });
  const notifications = (data ?? []) as Notification[];
  return (
    <div className="space-y-6">
      <NotificationsActionsBar />
      <VendorNotificationsList initialData={notifications} limit={10} />
    </div>
  );
}
