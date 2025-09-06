/** @format */

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function NotificationRow({ item, onRead }: { item: any; onRead: (id: string) => Promise<void> }) {
  const [status, setStatus] = useState<string>(item.status ?? 'NEW');
  const id = String(item.id ?? '');
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div>
        <div className="font-medium">{item.title ?? item.message ?? 'Notifikasi'}</div>
        <div className="text-xs text-muted-foreground">{String(item.created_at ?? '')}</div>
      </div>
      <div className="flex items-center gap-2">
        <Badge variant="secondary">{item.type ?? 'info'}</Badge>
        {status !== 'READ' && id && (
          <Button size="sm" variant="ghost" onClick={async () => { await onRead(id); setStatus('READ'); }}>Tandai dibaca</Button>
        )}
      </div>
    </div>
  );
}

