/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/format";
import { CART_SUMMARY } from "../constants";

type Props = {
  subtotal?: number;
  total?: number;
  itemCount?: number;
};

export function OrderSummaryCard({ subtotal = 0, total = 0, itemCount = 0 }: Props) {
  const rows: SummaryRow[] = [
    { label: "Subtotal", value: formatCurrency(subtotal) ?? "-" },
    { label: "Biaya Pengiriman", value: "Belum dihitung" },
    { label: "Diskon", value: "Rp 0" },
  ];

  const headerSlot = (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Estimasi Pengiriman
      </label>
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <Input
            placeholder={CART_SUMMARY.shippingPlaceholder}
            className="w-full rounded-lg text-sm pl-8 py-2 h-10"
          />
          <span className="material-icons-outlined absolute left-2.5 top-2.5 text-muted-foreground text-base">
            location_on
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="bg-muted hover:bg-muted/80 text-foreground px-3 rounded-lg text-sm font-bold transition border-border"
        >
          Cek
        </Button>
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <p className="text-xs text-muted-foreground text-right">
        {itemCount > 0 ? `${itemCount} item` : CART_SUMMARY.itemsCountLabel}
      </p>
      <Link
        href="/marketplace/pengiriman"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition flex items-center justify-center gap-2 group text-center"
      >
        Lanjutkan ke Pengiriman
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border">
        <span className="material-icons-outlined text-base text-emerald-500">verified_user</span>
        {CART_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      rows={rows}
      total={{
        label: "Total Pembayaran",
        value: formatCurrency(total || subtotal) ?? "-",
      }}
      headerSlot={headerSlot}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
