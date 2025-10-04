/** @format */

"use client";

import { useMemo, useState } from "react";
import { useBillingActions } from "@/hooks/queries/billing";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  trigger?: React.ReactNode;
};

export function PaymentVerifyDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState<"verified" | "rejected">("verified");
  const [gateway, setGateway] = useState<"" | "midtrans">("");
  const [externalId, setExternalId] = useState("");
  const { verifyVendorPay } = useBillingActions();
  const confirm = useConfirm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const id = paymentId.trim();
      if (!id) return;
      const ok = await confirm({
        variant: "edit",
        title: "Verifikasi pembayaran?",
        description: `Payment ID ${id} akan diubah menjadi ${status}.`,
        confirmText: "Verifikasi",
      });
      if (!ok) return;
      await verifyVendorPay.mutateAsync({
        id,
        payload: {
          status,
          gateway: gateway || undefined,
          external_id: externalId || undefined,
        },
      });
      setOpen(false);
      setPaymentId("");
      setGateway("");
      setExternalId("");
      setStatus("verified");
    } catch (_e) {
      // handled upstream
    } finally {
      setSubmitting(false);
    }
  };

  const Trigger = useMemo(() => {
    if (trigger) return trigger;
    return <Button type="button" variant="outline">Verify Payment</Button>;
  }, [trigger]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{Trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Verifikasi Pembayaran</SheetTitle>
          <SheetDescription>
            Masukkan Payment ID dan tentukan status verifikasi.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={onSubmit} className="space-y-4 p-4">
          <div className="space-y-2">
            <Label htmlFor="payment_id">Payment ID</Label>
            <Input
              id="payment_id"
              placeholder="mis. 123"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus((value as "verified" | "rejected") ?? "verified")
              }
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="verified">verified</SelectItem>
                <SelectItem value="rejected">rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateway">Gateway (opsional)</Label>
            <Input
              id="gateway"
              placeholder="midtrans"
              value={gateway}
              onChange={(event) =>
                setGateway(event.target.value === "midtrans" ? "midtrans" : "")
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="external_id">External ID (opsional)</Label>
            <Input
              id="external_id"
              placeholder="trx-123456"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
            />
          </div>

          <SheetFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting || !paymentId}>
              Simpan
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
