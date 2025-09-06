/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { listTenantReminders, upsertTenantReminders } from "@/services/api";
import { toast } from "sonner";

type Reminder = { id?: string; event_type: string; schedule_offset: number; active?: boolean };

export function RemindersTenantPanel() {
  const [items, setItems] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await listTenantReminders();
      if (res.success) setItems((res.data as any[]) as Reminder[]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const payload = items.map((x) => ({ id: x.id, event_type: x.event_type, schedule_offset: Number(x.schedule_offset || 0), active: !!x.active }));
      await upsertTenantReminders(payload as any);
      toast.success("Reminders disimpan");
      await load();
    } finally {
      setSaving(false);
    }
  }

  function addRow() {
    setItems((s) => [...s, { event_type: "BILLING", schedule_offset: 1, active: true }]);
  }

  function removeRow(idx: number) {
    setItems((s) => s.filter((_, i) => i !== idx));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder Otomatis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Atur pengingat otomatis berdasarkan event: isi jenis event (`event_type`), offset jadwal (`schedule_offset`, hari), dan aktif/nonaktif.</div>
          <div className="space-y-2">
            {items.map((it, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center">
                <Input placeholder="event_type (cth: BILLING|RAT|LOAN)" value={it.event_type} onChange={(e) => setItems((s) => s.map((x, i) => i === idx ? { ...x, event_type: e.target.value } : x))} />
                <Input type="number" placeholder="schedule_offset (hari)" value={String(it.schedule_offset ?? '')} onChange={(e) => setItems((s) => s.map((x, i) => i === idx ? { ...x, schedule_offset: Number(e.target.value || 0) } : x))} />
                <div className="flex items-center gap-2">
                  <Switch checked={!!it.active} onCheckedChange={(v) => setItems((s) => s.map((x, i) => i === idx ? { ...x, active: v } : x))} />
                  <span className="text-sm">Aktif</span>
                </div>
                <div className="text-xs text-muted-foreground">ID: {it.id ?? '-'}</div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => removeRow(idx)}>Hapus</Button>
                </div>
              </div>
            ))}
            {!items.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada pengingat</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={addRow}>Tambah</Button>
            <Button onClick={save} disabled={saving || loading}>{saving ? 'Menyimpan...' : 'Simpan'}</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

