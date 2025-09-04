/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { postPaymentGatewayWebhook } from "@/services/api";
import { toast } from "sonner";

export function WebhookSimulator() {
  const [gateway, setGateway] = useState("midtrans");
  const [externalId, setExternalId] = useState("");
  const [status, setStatus] = useState("settlement");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    try {
      setLoading(true);
      const payload = { external_id: externalId || `sim-${Date.now()}`, status };
      await postPaymentGatewayWebhook(gateway, payload);
      toast.success("Webhook dikirim");
    } catch (e: any) {
      toast.error(e?.message || "Gagal mengirim webhook");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Webhook Simulator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input placeholder="Gateway (midtrans)" value={gateway} onChange={(e) => setGateway(e.target.value)} />
          <Input placeholder="External ID (opsional)" value={externalId} onChange={(e) => setExternalId(e.target.value)} />
          <Input placeholder="Status (settlement|pending|failed)" value={status} onChange={(e) => setStatus(e.target.value)} />
          <Button onClick={send} disabled={loading}>{loading ? "Mengirim..." : "Kirim"}</Button>
        </div>
      </CardContent>
    </Card>
  );
}

