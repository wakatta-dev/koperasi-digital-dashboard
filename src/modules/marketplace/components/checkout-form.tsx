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
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-4">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Checkout
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Isi detail kontak untuk melanjutkan.
        </p>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Metode Pemenuhan
        </label>
        <Select
          value={fulfillment}
          onValueChange={(v) => setFulfillment(v as "PICKUP" | "DELIVERY")}
        >
          <SelectTrigger className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PICKUP">Ambil di tempat (Pickup)</SelectItem>
            <SelectItem value="DELIVERY">Kirim ke alamat (Delivery)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Nama
        </label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nama lengkap"
          className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          No. HP
        </label>
        <Input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="08xxxxxxxxxx"
          className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@contoh.com"
          className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      {fulfillment === "DELIVERY" ? (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Alamat
          </label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Alamat lengkap pengiriman"
            className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Catatan (opsional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan untuk penjual"
          className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800"
        />
      </div>

      <Button
        disabled={!isValid || submitting}
        onClick={handleSubmit}
        className="w-full bg-[#4338ca] hover:bg-[#3730a3] text-white font-bold"
      >
        {submitting ? "Memproses..." : "Checkout Sekarang"}
      </Button>
    </div>
  );
}
