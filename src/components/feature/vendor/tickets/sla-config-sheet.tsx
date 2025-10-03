/** @format */

"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTicketSLA, useTicketSlaActions } from "@/hooks/queries/ticketing";
import { useConfirm } from "@/hooks/use-confirm";

export function TicketSlaConfigSheet({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { data: slas = [] } = useTicketSLA();
  const { upsert } = useTicketSlaActions();
  const [form, setForm] = useState({
    category: "billing",
    sla_response_minutes: 60,
    sla_resolution_minutes: 1440,
  });
  const confirm = useConfirm();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger ?? <Button type="button" variant="outline">SLA Config</Button>}
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Ticket SLA</SheetTitle>
          <SheetDescription>Konfigurasi SLA untuk kategori tiket.</SheetDescription>
        </SheetHeader>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Kategori"
              value={form.category}
              onChange={(e) =>
                setForm((s) => ({ ...s, category: e.target.value }))
              }
            />
            <Input
              type="number"
              placeholder="Resp (m)"
              value={form.sla_response_minutes}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  sla_response_minutes: Number(e.target.value || 0),
                }))
              }
            />
            <Input
              type="number"
              placeholder="Resol (m)"
              value={form.sla_resolution_minutes}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  sla_resolution_minutes: Number(e.target.value || 0),
                }))
              }
            />
            <Button type="button" onClick={async () => {
              if (!form.category.trim()) return;
              const ok = await confirm({
                variant: "edit",
                title: "Simpan konfigurasi SLA?",
                description: `Kategori ${form.category} akan diperbarui.`,
                confirmText: "Simpan",
              });
              if (!ok) return;
              await upsert.mutateAsync(form);
            }}>
              Simpan
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            {(slas ?? []).map((s: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between border rounded p-2"
              >
                <div className="font-medium">{s.category}</div>
                <div>
                  Response: {s.sla_response_minutes}m • Resolution: {s.sla_resolution_minutes}m
                </div>
              </div>
            ))}
            {!slas?.length && (
              <div className="text-xs text-muted-foreground italic">
                Belum ada konfigurasi SLA
              </div>
            )}
          </div>
        </div>
        <SheetFooter className="p-4 pt-0">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Tutup</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
