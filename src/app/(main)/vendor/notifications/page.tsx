/** @format */

import { listNotificationsAction } from "@/actions/notifications";
import { VendorNotificationsList } from "@/components/feature/vendor/notifications/notifications-list";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const res = await listNotificationsAction({ limit: 10 });
  return <VendorNotificationsList initialData={res ?? []} limit={10} />;
}
