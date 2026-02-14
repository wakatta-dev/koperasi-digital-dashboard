/** @format */

"use client";

import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ensureSuccess } from "@/lib/api";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { checkoutMarketplace } from "@/services/api";
import type {
  MarketplaceCartResponse,
  MarketplaceOrderResponse,
} from "@/types/api/marketplace";
import { QK } from "@/hooks/queries/queryKeys";
import { FeatureSectionCard } from "../shared/feature-section-card";
import { FieldRow } from "../shared/field-row";
import { OptionTile } from "../shared/option-tile";

type Props = {
  cart: MarketplaceCartResponse;
  onSuccess: (order: MarketplaceOrderResponse) => void;
};

export function CheckoutForm({ cart, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [shippingOption, setShippingOption] = useState("JNE_REGULER");
  const [paymentMethod, setPaymentMethod] = useState("TRANSFER_BANK");
  const [bankOption, setBankOption] = useState("BCA");
  const [submitting, setSubmitting] = useState(false);
  const qc = useQueryClient();

  const isValid = useMemo(() => {
    const hasAddress =
      recipientName.trim() &&
      recipientPhone.trim() &&
      address.trim() &&
      province.trim() &&
      city.trim() &&
      district.trim() &&
      postalCode.trim();

    return (
      Boolean(email.includes("@")) &&
      Boolean(phone.trim()) &&
      Boolean(hasAddress) &&
      cart.items.length > 0
    );
  }, [
    address,
    cart.items.length,
    city,
    district,
    email,
    phone,
    postalCode,
    province,
    recipientName,
    recipientPhone,
  ]);

  const handleSubmit = async () => {
    if (!isValid) {
      showToastError(
        "Data checkout belum lengkap",
        "Lengkapi kontak, alamat, pengiriman, dan pembayaran.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const order = ensureSuccess(
        await checkoutMarketplace({
          fulfillment_method: "DELIVERY",
          customer_name: recipientName.trim(),
          customer_phone: recipientPhone.trim(),
          customer_email: email.trim(),
          customer_address:
            `${address.trim()}, ${district.trim()}, ${city.trim()}, ${province.trim()}, ${postalCode.trim()}`.trim(),
          notes: `shipping=${shippingOption}; payment=${paymentMethod}; bank=${bankOption}`,
        }),
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
    <div className="space-y-6">
      <FeatureSectionCard
        title="Informasi Kontak"
        description="Data ini digunakan untuk update pesanan"
        icon={<span className="material-icons-outlined">contact_mail</span>}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FieldRow
            label="Email"
            hint="Struk digital akan dikirim ke email ini."
          >
            <Input
              type="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FieldRow>

          <FieldRow label="Nomor WhatsApp">
            <Input
              type="tel"
              placeholder="812-3456-7890"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </FieldRow>
        </div>
      </FeatureSectionCard>

      <FeatureSectionCard
        title="Alamat Pengiriman"
        description="Pastikan alamat tujuan benar"
        icon={<span className="material-icons-outlined">location_on</span>}
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Nama Penerima">
              <Input
                placeholder="Nama Lengkap Penerima"
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
              />
            </FieldRow>
            <FieldRow label="Nomor Telepon Penerima">
              <Input
                placeholder="0812xxxx"
                value={recipientPhone}
                onChange={(event) => setRecipientPhone(event.target.value)}
              />
            </FieldRow>
          </div>

          <FieldRow label="Alamat Lengkap">
            <Textarea
              className="h-24 resize-none"
              placeholder="Nama Jalan, No. Rumah, RT/RW, Patokan (Cth: Seberang Masjid Al-Ikhlas)"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
            />
          </FieldRow>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Provinsi">
              <Input
                placeholder="Pilih Provinsi"
                value={province}
                onChange={(event) => setProvince(event.target.value)}
              />
            </FieldRow>
            <FieldRow label="Kota / Kabupaten">
              <Input
                placeholder="Pilih Kota/Kabupaten"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </FieldRow>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <FieldRow label="Kecamatan">
              <Input
                placeholder="Pilih Kecamatan"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
              />
            </FieldRow>
            <FieldRow label="Kode Pos">
              <Input
                placeholder="Contoh: 16750"
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
              />
            </FieldRow>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-foreground">Pilih Pengiriman</p>
            <div className="space-y-2">
              <OptionTile
                title="Reguler (JNE)"
                subtitle="Estimasi 2-3 Hari"
                value="JNE_REGULER"
                selected={shippingOption === "JNE_REGULER"}
                onSelect={setShippingOption}
                rightSlot={<span className="text-sm font-bold text-indigo-600">Rp 9.000</span>}
              />
              <OptionTile
                title="Same Day (Gojek)"
                subtitle="Estimasi 6-8 Jam"
                value="GOJEK_SAME_DAY"
                selected={shippingOption === "GOJEK_SAME_DAY"}
                onSelect={setShippingOption}
                rightSlot={<span className="text-sm font-bold text-indigo-600">Rp 25.000</span>}
              />
            </div>
          </div>
        </div>
      </FeatureSectionCard>

      <FeatureSectionCard
        title="Metode Pembayaran"
        description="Transaksi aman & terverifikasi otomatis"
        icon={<span className="material-icons-outlined">payments</span>}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <OptionTile
              title="QRIS"
              subtitle="Gopay, OVO, Dana"
              value="QRIS"
              selected={paymentMethod === "QRIS"}
              onSelect={setPaymentMethod}
            />
            <OptionTile
              title="Transfer Bank"
              subtitle="BCA, Mandiri, BRI"
              value="TRANSFER_BANK"
              selected={paymentMethod === "TRANSFER_BANK"}
              onSelect={setPaymentMethod}
            />
            <OptionTile
              title="E-Wallet"
              subtitle="LinkAja, ShopeePay"
              value="EWALLET"
              selected={paymentMethod === "EWALLET"}
              onSelect={setPaymentMethod}
            />
          </div>

          {paymentMethod === "TRANSFER_BANK" ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <p className="mb-3 text-sm font-bold text-foreground">Pilih Bank</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {(["BCA", "Mandiri", "BNI", "BRI"] as const).map((bank) => (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => setBankOption(bank)}
                    className={`h-11 rounded-lg border text-sm font-bold transition ${
                      bankOption === bank
                        ? "border-indigo-600 bg-indigo-50 text-indigo-600"
                        : "border-border bg-card text-foreground hover:border-indigo-300"
                    }`}
                  >
                    {bank}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Pembayaran akan diverifikasi secara otomatis, pastikan transfer
                sesuai nominal hingga 3 digit terakhir.
              </p>
            </div>
          ) : null}
        </div>
      </FeatureSectionCard>

      <Button
        type="button"
        className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700"
        disabled={!isValid || submitting}
        onClick={handleSubmit}
      >
        {submitting ? "Memproses..." : "Bayar Sekarang"}
      </Button>
    </div>
  );
}
