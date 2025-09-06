/** @format */

"use client";

import { useState, useMemo } from "react";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postPaymentGatewayWebhook } from "@/services/api";
import { toast } from "sonner";

export function WebhookSimulatorSheet({ trigger }: { trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [gateway, setGateway] = useState("midtrans");
  const [externalId, setExternalId] = useState("");
  const [status, setStatus] = useState("settlement");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = { external_id: externalId || `sim-${Date.now()}`, status } as any;
      await postPaymentGatewayWebhook(gateway, payload);
      toast.success("Webhook dikirim");
      setOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengirim webhook");
    } finally {
      setLoading(false);
    }
  };

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return (
      <Button type="button" variant="outline">Webhook Simulator</Button>
    );
  }, [trigger]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Payment Webhook Simulator</SheetTitle>
          <SheetDescription>Kirim payload simulasi untuk menguji webhook.</SheetDescription>
        </SheetHeader>
        <form onSubmit={onSubmit} className="p-4 space-y-3">
          <Input placeholder="Gateway (midtrans)" value={gateway} onChange={(e) => setGateway(e.target.value)} />
          <Input placeholder="External ID (opsional)" value={externalId} onChange={(e) => setExternalId(e.target.value)} />
          <Input placeholder="Status (settlement|pending|failed)" value={status} onChange={(e) => setStatus(e.target.value)} />
          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Tutup</Button>
            <Button type="submit" disabled={loading}>{loading ? "Mengirim..." : "Kirim"}</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

