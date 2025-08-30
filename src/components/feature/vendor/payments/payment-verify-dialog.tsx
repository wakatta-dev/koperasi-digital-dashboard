/** @format */

"use client";

import { useMemo, useState } from "react";
import { useBillingActions } from "@/hooks/queries/billing";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  trigger?: React.ReactNode;
};

export function PaymentVerifyDialog({ trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState("verified");
  const [gateway, setGateway] = useState("");
  const [externalId, setExternalId] = useState("");
  const { verifyVendorPay } = useBillingActions();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const id = paymentId.trim();
      if (!id) return;
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{Trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Verifikasi Pembayaran</DialogTitle>
          <DialogDescription>
            Masukkan Payment ID dan tentukan status verifikasi.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
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
            <select
              id="status"
              className="border rounded px-2 py-1"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="verified">verified</option>
              <option value="rejected">rejected</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gateway">Gateway (opsional)</Label>
            <Input
              id="gateway"
              placeholder="midtrans"
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting || !paymentId}>
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

