/** @format */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function NotifikasiPage() {
  // TODO integrate API: list notifications
  const notifications: any[] = [];

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
          <div className="space-y-4">
            {notifications.map((n, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">{n.title ?? n.message ?? 'Notifikasi'}</div>
                  <div className="text-xs text-muted-foreground">{String(n.created_at ?? '')}</div>
                </div>
                <Badge variant="secondary">{n.type ?? 'info'}</Badge>
              </div>
            ))}
            {!notifications.length && (
              <div className="text-sm text-muted-foreground italic">Tidak ada notifikasi</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

