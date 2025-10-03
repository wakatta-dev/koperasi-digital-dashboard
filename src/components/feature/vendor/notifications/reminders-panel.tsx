/** @format */

"use client";

import { useEffect, useState } from "react";
import { useNotificationReminders, useNotificationReminderActions } from "@/hooks/queries/notifications";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { NotificationReminder, ReminderRequest } from "@/types/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useConfirm } from "@/hooks/use-confirm";

export function NotificationRemindersPanel() {
  // Avoid defaulting to [] here, which creates a new array each render
  // and can cause an infinite loop when syncing to local state.
  const { data: reminders } = useNotificationReminders();
  const { upsert } = useNotificationReminderActions();

  const [rows, setRows] = useState<ReminderRequest[]>([]);
  const confirm = useConfirm();

  useEffect(() => {
    if (reminders !== undefined) {
      const mapped = (reminders as NotificationReminder[]).map<ReminderRequest>((r) => ({
        id: r.id,
        event_type: r.event_type,
        schedule_offset: r.schedule_offset,
        schedule_unit: r.schedule_unit,
        active: r.active,
      }));
      setRows(mapped);
    }
  }, [reminders]);

  const addRow = () => {
    setRows((r) => [
      ...r,
      {
        event_type: "BILLING_DUE",
        schedule_offset: 3,
        schedule_unit: "DAY",
        active: true,
      },
    ]);
  };

  const save = async () => {
    const ok = await confirm({
      variant: "edit",
      title: "Simpan pengingat?",
      description: `${rows.length} konfigurasi pengingat akan diterapkan.`,
      confirmText: "Simpan",
    });
    if (!ok) return;
    await upsert.mutateAsync(rows);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notification Reminders</CardTitle>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addRow}>Tambah</Button>
            <Button type="button" onClick={save}>Simpan</Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rows.map((r, idx) => (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center" key={idx}>
              <Input
                placeholder="Event Type (e.g., BILLING_DUE)"
                value={r.event_type}
                onChange={(e) =>
                  setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, event_type: e.target.value } : x)))
                }
              />
              <Input
                type="number"
                min={0}
                placeholder="Offset (days)"
                value={String(r.schedule_offset)}
                onChange={(e) =>
                  setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, schedule_offset: Number(e.target.value || 0) } : x)))
                }
              />
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!r.active}
                  onCheckedChange={(v) =>
                    setRows((prev) => prev.map((x, i) => (i === idx ? { ...x, active: !!v } : x)))
                  }
                />
                <span className="text-sm text-muted-foreground">Active</span>
              </div>
            </div>
          ))}
          {!rows.length && (
            <div className="text-sm text-muted-foreground italic">No reminders.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
