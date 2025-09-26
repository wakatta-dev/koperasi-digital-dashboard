/** @format */

import { VendorNotificationsList } from "@/components/feature/vendor/notifications/notifications-list";
import { NotificationsActionsBar } from "@/components/feature/vendor/notifications/notifications-actions-bar";
import { listVendorNotifications } from "@/services/api";
import type { Notification } from "@/types/api";

export const dynamic = "force-dynamic";

// TODO integrate API: ensure notifications endpoints wired for list/create/update
export default async function NotificationsPage() {
  const res = await listVendorNotifications({ limit: 10 }).catch(() => null);
  const notifications = (res?.data ?? []) as Notification[];
  return (
    <div className="space-y-6">
      <NotificationsActionsBar />
      <VendorNotificationsList initialData={notifications} limit={10} />
    </div>
  );
}
