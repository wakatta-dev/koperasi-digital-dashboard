/** @format */

"use client";

import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useNotificationReminders, useNotificationReminderActions } from "@/hooks/queries/notifications";
import { useConfirm } from "@/hooks/use-confirm";

export function NotificationRemindersSheet({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: reminders } = useNotificationReminders();
  const { upsert } = useNotificationReminderActions();
  const [rows, setRows] = useState<any[]>([]);
  const confirm = useConfirm();

  useEffect(() => {
    if (reminders !== undefined) {
      setRows(reminders as any);
    }
  }, [reminders]);

  const addRow = () => {
    setRows((r) => [...r, { event_type: "BILLING_DUE", schedule_offset: 3, active: true }]);
  };

  const save = async () => {
    const ok = await confirm({
      variant: "edit",
      title: "Simpan pengingat?",
      description: `${rows.length} konfigurasi pengingat akan diterapkan.`,
      confirmText: "Simpan",
    });
    if (!ok) return;
    await upsert.mutateAsync(rows as any);
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? <Button type="button" variant="outline">Reminders</Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0">
        <SheetHeader>
          <SheetTitle>Notification Reminders</SheetTitle>
          <SheetDescription>Kelola aturan pengingat notifikasi.</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addRow}>Tambah</Button>
            <Button type="button" onClick={save}>Simpan</Button>
          </div>
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
        <SheetFooter className="p-4 pt-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Tutup</Button>
          <Button type="button" onClick={save}>Simpan</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
