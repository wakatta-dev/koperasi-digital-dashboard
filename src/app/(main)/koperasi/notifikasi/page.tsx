/** @format */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listNotifications, updateNotificationStatus } from "@/services/api";
import { NotificationRow } from "@/components/feature/koperasi/notifications/notification-row";
import { RemindersTenantPanel } from "@/components/feature/koperasi/notifications/reminders-tenant-panel";
import { NotificationsClient } from "@/components/feature/koperasi/notifications/notifications-client";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const res = await listNotifications({ limit: 50 }).catch(() => null);
  const notifications = res && res.success ? (res.data as any[]) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notifikasi</h2>
        <p className="text-muted-foreground">Reminder otomatis dan aktivitas sistem</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Notifikasi</CardTitle>
          <CardDescription>Notifikasi terbaru</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationsClient />
        </CardContent>
      </Card>

      <RemindersTenantPanel />
    </div>
  );
}
