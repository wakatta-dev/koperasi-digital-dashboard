/** @format */

"use client";

import { useState, useMemo } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { checkoutMarketplace } from "@/services/api";
import type {
  MarketplaceCartResponse,
  MarketplaceOrderResponse,
} from "@/types/api/marketplace";
import { ensureSuccess } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { QK } from "@/hooks/queries/queryKeys";

type Props = {
  cart: MarketplaceCartResponse;
  onSuccess: (order: MarketplaceOrderResponse) => void;
};

export function CheckoutForm({ cart, onSuccess }: Props) {
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">(
    "PICKUP"
  );
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();

  const isValid = useMemo(() => {
    if (!name.trim() || !phone.trim() || !email.includes("@")) return false;
    if (fulfillment === "DELIVERY" && !address.trim()) return false;
    return cart.items.length > 0;
  }, [address, cart?.items?.length, email, fulfillment, name, phone]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    try {
      const order = ensureSuccess(
        await checkoutMarketplace({
          fulfillment_method: fulfillment,
          customer_name: name.trim(),
          customer_phone: phone.trim(),
          customer_email: email.trim(),
          customer_address: fulfillment === "DELIVERY" ? address.trim() : "",
          notes: notes.trim(),
        })
      );
      showToastSuccess("Checkout berhasil", "Pesanan Anda telah dibuat");
      onSuccess(order);
      await qc.invalidateQueries({ queryKey: QK.marketplace.cart() });
    } catch (err: any) {
      const msg = (err as Error)?.message?.toLowerCase() ?? "";
      if (msg.includes("insufficient stock")) {
        showToastError("Stok tidak cukup", err);
      } else if (msg.includes("not available")) {
        showToastError("Produk tidak tersedia", err);
      } else {
        showToastError("Gagal checkout", err);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Checkout</h3>
        <p className="text-sm text-muted-foreground">
          Isi detail kontak untuk melanjutkan.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">
          Metode Pemenuhan
        </label>
        <Select
          value={fulfillment}
          onValueChange={(v) => setFulfillment(v as "PICKUP" | "DELIVERY")}
        >
          <SelectTrigger className="w-full rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PICKUP">Ambil di tempat (Pickup)</SelectItem>
            <SelectItem value="DELIVERY">Kirim ke alamat (Delivery)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Nama
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap"
          className="rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          No. HP
        </label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          className="rounded-lg"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@contoh.com"
          className="rounded-lg"
        />
      </div>

      {fulfillment === "DELIVERY" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Alamat
          </label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap pengiriman"
            className="rounded-lg"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">
          Catatan (opsional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan untuk penjual"
          className="rounded-lg"
        />
      </div>

      <Button
        disabled={!isValid || submitting}
        onClick={handleSubmit}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
      >
        {submitting ? "Memproses..." : "Checkout Sekarang"}
      </Button>
    </div>
  );
}
