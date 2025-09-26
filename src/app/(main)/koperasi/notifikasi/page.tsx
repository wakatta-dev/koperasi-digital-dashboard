/** @format */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listNotifications } from "@/services/api";
import { RemindersTenantPanel } from "@/components/feature/koperasi/notifications/reminders-tenant-panel";
import { NotificationsClient } from "@/components/feature/koperasi/notifications/notifications-client";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  const res = await listNotifications({ limit: 20 }).catch(() => null);
  const notifications = res && res.success ? (res.data as any[]) : [];
  const next = (res as any)?.meta?.pagination?.next_cursor as string | undefined;

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
          <NotificationsClient initialItems={notifications} initialCursor={next} />
        </CardContent>
      </Card>

      <RemindersTenantPanel />
    </div>
  );
}
