/** @format */

"use client";

import { useState } from "react";
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
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  invoiceId: string | number;
  trigger?: React.ReactNode;
};

export function UploadPaymentDialog({ invoiceId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [proofUrl, setProofUrl] = useState("");
  const [gateway, setGateway] = useState("");
  const [externalId, setExternalId] = useState("");
  const { createClientPayment } = useBillingActions();
  const confirm = useConfirm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        method: "manual",
        proof_url: proofUrl,
        gateway: gateway || undefined,
        external_id: externalId || undefined,
      } as any;
      const ok = await confirm({
        variant: "create",
        title: "Kirim bukti pembayaran?",
        description: "Data pembayaran akan dikirim ke server.",
        confirmText: "Kirim",
      });
      if (!ok) return;
      await createClientPayment.mutateAsync({ invoiceId, payload });
      setOpen(false);
      setProofUrl("");
      setGateway("");
      setExternalId("");
    } catch (_e) {
      // handled upstream
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Upload Bukti</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Bukti Pembayaran</DialogTitle>
          <DialogDescription>
            Masukkan URL bukti transfer atau pembayaran manual. Opsi gateway dan external id bersifat opsional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proof_url">Proof URL</Label>
            <Input
              id="proof_url"
              placeholder="https://.../bukti.jpg"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              required
            />
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
            <Button type="submit" disabled={submitting || !proofUrl}>
              Kirim
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
