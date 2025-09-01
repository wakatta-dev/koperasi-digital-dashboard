/** @format */

import { listNotificationsAction } from "@/actions/notifications";
import { VendorNotificationsList } from "@/components/feature/vendor/notifications/notifications-list";
import { NotificationRemindersPanel } from "@/components/feature/vendor/notifications/reminders-panel";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const res = await listNotificationsAction({ limit: 10 });
  return (
    <div className="space-y-6">
      <VendorNotificationsList initialData={res ?? []} limit={10} />
      <NotificationRemindersPanel />
    </div>
  );
}
