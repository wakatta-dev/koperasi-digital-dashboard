/** @format */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listNotifications } from "@/services/api";
import { RemindersTenantPanel } from "@/components/feature/koperasi/notifications/reminders-tenant-panel";
import { NotificationsClient } from "@/components/feature/koperasi/notifications/notifications-client";
import type { Notification, ListNotificationsResponse } from "@/types/api";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const res: ListNotificationsResponse | null = await listNotifications({
    limit: 20,
  }).catch(() => null);

  const notifications: Notification[] = Array.isArray(res?.data) && res?.success
    ? (res.data as Notification[])
    : [];
  const next = res?.meta?.pagination?.next_cursor || undefined;
  const errorMessage = res && !res.success ? res.message : null;

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
          {errorMessage ? (
            <div className="mb-3 text-sm text-destructive">{errorMessage}</div>
          ) : null}
          <NotificationsClient initialItems={notifications} initialCursor={next} />
        </CardContent>
      </Card>

      <RemindersTenantPanel />
    </div>
  );
}
